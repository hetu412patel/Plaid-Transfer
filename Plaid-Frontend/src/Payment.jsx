import React, { useState } from 'react'
import axios from 'axios';
import { usePlaidLink } from 'react-plaid-link';
import { useEffect } from 'react';

const TransferUi = ({ transferLinkTokenData }) => {

    // step - 3 : open transferUI for transfer money from one account to another

    const [public_token_transfer, setPublicTokenTransfer] = useState()

    axios.defaults.baseURL = "http://localhost:8000"
    const transferData = async () => {
        open()
    }

    const transferConfig = {
        token: transferLinkTokenData,
        onSuccess: (public_token, metadata) => {
            console.log("publicTokenTransfer", public_token);
            setPublicTokenTransfer(public_token)
            console.log("successTransfer", metadata);

        }
    };
    const { open, ready } = usePlaidLink(transferConfig);

    return (
        <>
            <button onClick={transferData} disabled={!ready}>Transfer UI</button>
            {public_token_transfer && <div style={{ paddingTop: '10px'}}>Transfer done successfully...</div>}
        </>
    )
}

// step - 2 : generate different data for creating transfer-link-token

const Payment = () => {

    const [linkToken, setLinkToken] = useState()
    const [publicToken, setPublicToken] = useState()
    const [click, setClick] = useState(false)
    const [transferLinkTokenData, setTransferLinkTokenData] = useState()

    axios.defaults.baseURL = "http://localhost:8000"

    const transferHandler = async () => {
        setClick(true)
        // ********************* exchange link token ***********************
        let accessToken = await axios.post("/exchange_public_token", { publicToken }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        var accessTokenData = accessToken?.data?.accessToken
        const item_id = accessToken?.data?.item_id
        // setAccessToken(accessTokenData)
        console.log("item_id", item_id);
        console.log("accessToken", accessTokenData);

        // ********************* auth ***********************
        const auth = await axios.post('/auth', { accessTokenData }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const account_id = auth?.data?.data?.numbers?.ach[0]?.account_id
        console.log("authData", auth?.data?.data);
        console.log("auth", auth?.data?.data?.numbers?.ach[0]?.account_id);

        // ********************* transfer-intent ***********************
        const intentResponse = await axios.post("/transfer-intent", { account_id, accessTokenData }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const intent_id = intentResponse?.data?.data?.transfer_intent?.id
        console.log("intentResponse", intentResponse?.data);
        // setIntentData(intentResponse)
        console.log("intentResponse", intent_id);

        // *************************transfer-link-token************************
        const transferLinkToken = await axios.post("/transfer-link-token-initial", { intent_id, accessTokenData }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const transferLinkTokenData = transferLinkToken?.data?.data?.link_token
        setTransferLinkTokenData(transferLinkTokenData)
        console.log("transferLinkToken", transferLinkTokenData)
    }

    // step -1 : connect bank accounts using createing link token

    useEffect(() => {
        const fetch = async () => {
            const response = await axios.post("/create_link_token", {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log("linkToken", response?.data?.link_token);
            setLinkToken(response?.data?.link_token)
        }
        fetch()
    }, [])


    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
            setPublicToken(public_token)
        }
    });

    return (
        <div>
            <button onClick={() => open()} disabled={!ready}>connect Account</button>
            <button onClick={transferHandler} style={{ marginLeft: "5px", marginRight: '5px' }} disabled={!publicToken ? true : false}>
                Transfer
            </button>

            {(publicToken && click) && <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>Wait for some time...</div>}

            {(transferLinkTokenData) && <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>You are ready for transfer process...</div>}

            <TransferUi transferLinkTokenData={transferLinkTokenData} />

        </div>
    );
}

export default Payment

