const {plaidClient} = require('../config')

const createLinkToken = async (request, response) => {
    const plaidRequest = {
        user: {
            client_user_id: 'user',
        },
        client_name: 'Plaid Test App',
        products: ['auth', 'transfer'],
        language: 'en',
        country_codes: ['US'],
        link_customization_name: "payment_ui"
    };
    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
        response.status(200).json(createTokenResponse?.data);
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Failure" })
    }
}

const exchangePublicToken = async (request, response) => {
    const publicToken = request.body.publicToken;
    try {
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
        //   console.log("plaidResponse",plaidResponse?.data?.item_id);
        const accessToken = plaidResponse?.data?.access_token;
        const item_id = plaidResponse?.data?.item_id
        response.status(200).json({ accessToken, item_id });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Failure" })
    }
}

const authData = async (request, response) => {
    try {
        const access_token = request.body.accessTokenData
        const plaidRequest = { access_token }

        const plaidResponse = await plaidClient.authGet(plaidRequest);
        // console.log("authRes", plaidResponse?.data);
        response.status(200).json({ data: plaidResponse?.data })
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Failure" })
    }
}

const transferIntent = async(request, response) => {
    const intentRequest = {
        mode: 'PAYMENT',
        amount: '12.34',
        description: 'payment',
        ach_class: 'ppd',
        user: {
          legal_name: 'Leslie Knope',
        },
        account_id : request.body.account_id
      };
      try {
        const intentResponse = await plaidClient.transferIntentCreate(intentRequest);
        // console.log("intentResponse",intentResponse?.data);
        response.status(200).json({data : intentResponse?.data})
      } catch (error) {
        console.log(error);
        response.status(500).json({message:"failure"})
      }
}

const transferLinkToken = async(request, response) => {
    const linkTokenParams = {
        user: {
          client_user_id: 'user',
        },
        client_name: 'Plaid Test App',
        products: ['transfer'],
        language: 'en',
        country_codes: ['US'],
        transfer: {
          intent_id : request.body.intent_id,
        },
        access_token : request.body.accessTokenData,
        link_customization_name: "payment_ui"
      }
      try {
        const linkTokenResponse = await plaidClient.linkTokenCreate(linkTokenParams);
        // console.log("linkTokenResponse",linkTokenResponse?.data);
        response.status(200).json({data: linkTokenResponse?.data})
      } catch (error) {
        console.log(error);
        response.status(500).json({message: error.message})
      }
}

module.exports = { createLinkToken, exchangePublicToken, authData, transferIntent, transferLinkToken }