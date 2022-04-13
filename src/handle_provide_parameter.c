#include "nested_plugin.h"

static void check_token_id(ethPluginProvideParameter_t *msg, context_t *context)
{
    for (uint8_t i = 0; i < PARAMETER_LENGTH; i++)
    {
        if (msg->parameter[i] != 0)
        {
            PRINTF("IS NOT 0\n");
            context->booleans |= IS_COPY;
            break;
        }
    }
}

// create, processInputOrder and processOutputOrder have similar prototype
static void handle_create(ethPluginProvideParameter_t *msg, context_t *context)
{
    // Switch to current struct parsing function.
    if (context->on_struct)
    {
        if (context->on_struct == S_BATCHED_INPUT_ORDERS)
            parse_batched_input_orders(msg, context);
        else if (context->on_struct == S_BATCHED_OUTPUT_ORDERS)
            parse_batched_output_orders(msg, context);
        else if (context->on_struct == S_ORDER)
            parse_order(msg, context);
        else
        {
            PRINTF("handle_create on_struct ERROR\n");
            msg->result = ETH_PLUGIN_RESULT_ERROR;
        }
        return;
    }
    PRINTF("PARSING CREATE\n");
    switch ((create_parameter)context->next_param)
    {
    case CREATE__TOKEN_ID:
        PRINTF("CREATE__TOKEN_ID\n");
        // Check if it's copy or create
        if (context->selectorIndex == CREATE)
            check_token_id(msg, context);
        break;
    case CREATE__OFFSET_BIO:
        PRINTF("CREATE__OFFSET_BIO\n");
        copy_offset(msg, context); // osef, because it's always the next param
        break;
    case CREATE__LEN_BIO:
        PRINTF("CREATE__LEN_BIO\n");
        context->current_length = U4BE(msg->parameter, PARAMETER_LENGTH - 4);
        context->number_of_tokens = context->current_length;
        context->length_offset_array = U4BE(msg->parameter, PARAMETER_LENGTH - 4);
        PRINTF("current_length: %d\n", context->current_length);
        break;
    case CREATE__OFFSET_ARRAY_BIO:
        context->length_offset_array--;
        PRINTF("CREATE__OFFSET_ARRAY_BIO, index: %d\n",
               context->length_offset_array);
        if (context->length_offset_array < 2)
        {
            context->offsets_lvl0[context->length_offset_array] =
                U4BE(msg->parameter, PARAMETER_LENGTH - 4);
            PRINTF("offsets_lvl0[%d]: %d\n",
                   context->length_offset_array,
                   context->offsets_lvl0[context->length_offset_array]);
        }
        // is on last offset.
        if (context->length_offset_array == 0)
        {
            switch (context->selectorIndex)
            {
            case CREATE:
            case PROCESS_INPUT_ORDERS:
                context->on_struct = (on_struct)S_BATCHED_INPUT_ORDERS;
                context->next_param = (batch_input_orders)BIO__INPUTTOKEN;
                break;
            case PROCESS_OUTPUT_ORDERS:
                context->on_struct = (on_struct)S_BATCHED_OUTPUT_ORDERS;
                context->next_param = (batch_output_orders)BOO__OUTPUTTOKEN;
                break;
            default:
                PRINTF("Selector Index not supported: %d\n", context->selectorIndex);
                msg->result = ETH_PLUGIN_RESULT_ERROR;
                break;
            }
        }
        return;
    case CREATE__BIO:
        PRINTF("NOP NOP CREATE__BIO\n");
        return;
    default:
        PRINTF("Param not supported: %d\n", context->next_param);
        msg->result = ETH_PLUGIN_RESULT_ERROR;
        break;
    }
    context->next_param++;
}

static void handle_destroy(ethPluginProvideParameter_t *msg, context_t *context)
{
    switch ((destroy_parameter)context->next_param)
    {
    case DESTROY__TOKEN_ID:
        PRINTF("DESTROY TOKEN ID\n");
        context->next_param++;
        break;
    case DESTROY__BUY_TOKEN:
        PRINTF("DESTROY BUY TOKEN\n");
        copy_address(context->token1_address, msg->parameter, ADDRESS_LENGTH);
        context->next_param++;
        break;
    case DESTROY__OFFSET_ORDERS:
        PRINTF("DESTROY OFFSET ORDERS\n");
        context->next_param++;
        break;
    case DESTROY__LEN_ORDERS:
        PRINTF("DESTROY LEN ORDERS\n");
        context->number_of_tokens = U4BE(msg->parameter, PARAMETER_LENGTH - 4);
        PRINTF("DESTROY NUMBER OF TOKENS:%d\n", context->number_of_tokens);
        context->next_param++;
        break;
    case DESTROY__ORDERS:
        PRINTF("DESTROY ORDERS\n");
        break;
    default:
        PRINTF("Param not supported: %d\n", context->next_param);
        msg->result = ETH_PLUGIN_RESULT_ERROR;
        break;
    }
}

static void handle_release_tokens(ethPluginProvideParameter_t *msg, context_t *context)
{
    PRINTF("HANDLE_RELEASE_TOKENS\n");
    switch ((release_tokens_parameter)context->next_param)
    {
    case RELEASE_OFFSET_TOKENS:
        PRINTF("RELEASE_OFFSET_TOKENS\n");
        context->next_param++;
        break;
    case RELEASE_LEN_TOKENS:
        PRINTF("RELEASE_LEN_TOKENS\n");
        context->current_length = U4BE(msg->parameter, PARAMETER_LENGTH - 4);
        context->number_of_tokens = context->current_length;
        context->next_param++;
        break;
    case RELEASE_ARRAY_TOKENS:
        // is first array element
        if (context->number_of_tokens == context->current_length)
        {
            PRINTF("RELEASE copy first token address.\n");
            copy_address(context->token1_address, msg->parameter, ADDRESS_LENGTH);
        }
        context->current_length--;
        // is last array element && multiple tokens
        if (context->number_of_tokens > 1 && context->current_length == 0)
        {
            PRINTF("RELEASE copy last token address.\n");
            copy_address(context->token2_address, msg->parameter, ADDRESS_LENGTH);
        }
        PRINTF("RELEASE_TOKENS token index: %d\n", context->current_length);
        break;
    default:
        PRINTF("Param not supported: %d\n", context->next_param);
        msg->result = ETH_PLUGIN_RESULT_ERROR;
        break;
    }
}

static void handle_transfer_from(ethPluginProvideParameter_t *msg, context_t *context)
{
    PRINTF("GPIRIOU HANDLE TRANSFER FROM\n");
    switch ((transfer_from_parameter)context->next_param)
    {
    case FROM:
        break;
    case TO:
        copy_address(context->token1_address, msg->parameter, sizeof(context->token1_address));
        break;
    case TOKEN_ID:
        break;
    default:
        PRINTF("Param not supported: %d\n", context->next_param);
        msg->result = ETH_PLUGIN_RESULT_ERROR;
        break;
    }
    context->next_param++;
}

void handle_provide_parameter(void *parameters)
{
    ethPluginProvideParameter_t *msg = (ethPluginProvideParameter_t *)parameters;
    context_t *context = (context_t *)msg->pluginContext;
    // We use `%.*H`: it's a utility function to print bytes. You first give
    // the number of bytes you wish to print (in this case, `PARAMETER_LENGTH`) and then
    // the address (here `msg->parameter`).
    PRINTF("___\nplugin provide parameter: offset %d\nBytes: \033[0;31m %.*H \033[0m \n",
           msg->parameterOffset,
           PARAMETER_LENGTH,
           msg->parameter);

    msg->result = ETH_PLUGIN_RESULT_OK;

    switch (context->selectorIndex)
    {
        // create, processInputOrders and processOutputOrders have similar prototype, so we use the same parsing method.
    case CREATE:
    case PROCESS_INPUT_ORDERS:
    case PROCESS_OUTPUT_ORDERS:
        handle_create(msg, context);
        break;
    case DESTROY:
        handle_destroy(msg, context);
        break;
    case RELEASE_TOKENS:
        handle_release_tokens(msg, context);
        break;
    case TRANSFER_FROM:
        handle_transfer_from(msg, context);
        break;
    default:
        PRINTF("Selector Index not supported: %d\n", context->selectorIndex);
        msg->result = ETH_PLUGIN_RESULT_ERROR;
        break;
    }
}