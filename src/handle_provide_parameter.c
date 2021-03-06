#include "nested_plugin.h"

/**
 * Check token id, set IS_COPY is token id is not '000...'
 */
static void check_token_id(ethPluginProvideParameter_t *msg, context_t *context)
{
    for (uint8_t i = 0; i < PARAMETER_LENGTH; i++)
    {
        if (msg->parameter[i] != 0)
        {
            context->booleans |= IS_COPY;
            break;
        }
    }
}

/**
 * parse both create, processInputOrder and processOutputOrder.
 */
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
    switch ((create_parameter)context->next_param)
    {
    case CREATE__TOKEN_ID:
        PRINTF("CREATE__TOKEN_ID\n");
        // Check if it's copy or create
        if (context->selectorIndex == CREATE)
            check_token_id(msg, context);
        // We could get 'tokenId' here
        break;
    case CREATE__OFFSET_BIO:
        PRINTF("CREATE__OFFSET_BIO\n");
        // No need to copy the offset here, because it's always the next parameter
        break;
    case CREATE__LEN_BIO:
        PRINTF("CREATE__LEN_BIO\n");
        // For now, there is always 1 batchOrder in each Tx, we will parse the last one if there are multiple batchOrders
        context->current_length = U4BE(msg->parameter, PARAMETER_LENGTH - 4);
        break;
    case CREATE__OFFSET_ARRAY_BIO:
        context->current_length--;
        PRINTF("CREATE__OFFSET_ARRAY_BIO, index: %d\n",
               context->current_length);
        // is on last offset.
        if (context->current_length == 0)
        {
            // Switch to according struct's parsing method.
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
    default:
        PRINTF("Param not supported: %d\n", context->next_param);
        msg->result = ETH_PLUGIN_RESULT_ERROR;
        break;
    }
    context->next_param++;
}

static void handle_destroy(ethPluginProvideParameter_t *msg, context_t *context)
{
    // Switch to current struct parsing function.
    if (context->on_struct == S_ORDER)
    {
        parse_order(msg, context);
        return;
    }
    switch ((destroy_parameter)context->next_param)
    {
    case DESTROY__TOKEN_ID:
        PRINTF("DESTROY TOKEN ID\n");
        break;
    case DESTROY__BUY_TOKEN:
        PRINTF("DESTROY BUY TOKEN\n");
        copy_address(context->token1_address, msg->parameter, ADDRESS_LENGTH);
        PRINTF("Copied buyToken to token1_address: %.*H\n", ADDRESS_LENGTH, context->token1_address);
        break;
    case DESTROY__OFFSET_ORDERS:
        PRINTF("DESTROY OFFSET ORDERS\n");
        // No need to copy the offset here, because it's always the next parameter
        break;
    case DESTROY__LEN_ORDERS:
        PRINTF("DESTROY LEN ORDERS\n");
        context->number_of_tokens = U4BE(msg->parameter, PARAMETER_LENGTH - 4);
        PRINTF("number_of_tokens: %d\n", context->number_of_tokens);
        break;
    case DESTROY__ORDERS:
        PRINTF("DESTROY ORDERS");
        // Switch to order's parsing
        context->on_struct = (on_struct)S_ORDER;
        context->next_param = (order)ORDER__OPERATOR;
        return;
    default:
        PRINTF("Param not supported: %d\n", context->next_param);
        msg->result = ETH_PLUGIN_RESULT_ERROR;
        break;
    }
    context->next_param++;
}

static void handle_release_tokens(ethPluginProvideParameter_t *msg, context_t *context)
{
    switch ((release_tokens_parameter)context->next_param)
    {
    case RELEASE__OFFSET_TOKENS:
        PRINTF("RELEASE__OFFSET_TOKENS\n");
        // No need to copy the offset here, because it's always the next parameter
        break;
    case RELEASE__LEN_TOKENS:
        PRINTF("RELEASE__LEN_TOKENS\n");
        context->number_of_tokens = U4BE(msg->parameter, PARAMETER_LENGTH - 4);
        context->current_length = U4BE(msg->parameter, PARAMETER_LENGTH - 4);
        break;
    case RELEASE__ARRAY_TOKENS:
        // is first array element
        if (context->number_of_tokens == context->current_length)
        {
            PRINTF("RELEASE copy first token address.\n");
            copy_address(context->token1_address, msg->parameter, ADDRESS_LENGTH);
            PRINTF("Copied to token1_address: %.*H\n", ADDRESS_LENGTH, context->token1_address);
        }
        context->current_length--;
        // is last array element && multiple tokens
        if (context->number_of_tokens > 1 && context->current_length == 0)
        {
            PRINTF("RELEASE copy last token address.\n");
            copy_address(context->token2_address, msg->parameter, ADDRESS_LENGTH);
            PRINTF("Copied to token2_address: %.*H\n", ADDRESS_LENGTH, context->token2_address);
        }
        PRINTF("RELEASE_TOKENS token index: %d\n", context->current_length);
        return;
    default:
        PRINTF("Param not supported: %d\n", context->next_param);
        msg->result = ETH_PLUGIN_RESULT_ERROR;
        break;
    }
    context->next_param++;
}

static void handle_transfer_from(ethPluginProvideParameter_t *msg, context_t *context)
{
    switch ((transfer_from_parameter)context->next_param)
    {
    case TRANSFER_FROM__FROM:
        break;
    case TRANSFER_FROM__TO:
        copy_address(context->token1_address, msg->parameter, ADDRESS_LENGTH);
        break;
    case TRANSFER_FROM__TOKEN_ID:
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