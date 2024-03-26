const express = require("express");
const router = express.Router();

const { createLinkToken, exchangePublicToken, authData, transferIntent, transferLinkToken } = require('../controller/functions')

router.post('/create_link_token', createLinkToken)
router.post('/exchange_public_token', exchangePublicToken)
router.post('/auth', authData)
router.post('/transfer-intent', transferIntent)
router.post('/transfer-link-token-initial', transferLinkToken)

module.exports = router;
