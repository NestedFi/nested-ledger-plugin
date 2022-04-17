#include "nested_plugin.h"

// EDIT THIS: Adapt this function to your needs! Remember, the information for tokens are held in
// `msg->item1` and `msg->item2`. If those pointers are `NULL`, this means the ethereum app didn't
// find any info regarding the requested tokens!

void handle_provide_token(void *parameters)
{
    PRINTF("GPIRIOU PROVIDE TOKEN\n");
    ethPluginProvideInfo_t *msg = (ethPluginProvideInfo_t *)parameters;
    context_t *context = (context_t *)msg->pluginContext;

    // The Ethereum App found the information for the requested token!
    if (msg->item1)
    {
        context->booleans |= TOKEN1_FOUND;
        // Store its decimals.
        context->token1_decimals = msg->item1->token.decimals;
        // Store its ticker.
        strlcpy(context->token1_ticker, (char *)msg->item1->token.ticker, sizeof(context->token1_ticker));
    }
    else
    {
        PRINTF("handle_provide_token NO item1\n");
    }

    // The Ethereum App found the information for the requested token!
    if (msg->item2)
    {
        context->booleans |= TOKEN2_FOUND;
        // Only the ticker is stored for token2.
        strlcpy(context->token2_ticker, (char *)msg->item2->token.ticker, sizeof(context->token2_ticker));
        PRINTF("GPIRIOU TOKEN2 FOUND !\n");
        PRINTF("GPIRIOU TICKER2:%.*H\n", sizeof(context->token2_ticker), context->token2_ticker);
    }

    if (context->selectorIndex == RELEASE_TOKENS)
    {
        if (context->number_of_tokens == 2 && context->booleans & TOKEN1_FOUND && context->booleans & TOKEN2_FOUND)
            msg->additionalScreens++;
    }

    msg->result = ETH_PLUGIN_RESULT_OK;
}