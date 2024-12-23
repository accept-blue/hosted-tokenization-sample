const chargeButton = document.querySelector('#charge');
const nameEl = document.querySelector('#name');
const amountEl = document.querySelector('#amount');
const iframeContainerEl = document.querySelector('#iframe-container');
const maskedCardEl = document.querySelector('#masked-card');
const maskedCvv2El = document.querySelector('#masked-cvv2');
const errorMessageEl = document.querySelector('#error-message');

chargeButton.addEventListener('click', _onChargeClick);

const publicSourceKey = 'pk_PUBLIC_SOURCE_KEY_HERE';
const options = {
  target: '#iframe-container'
};
const hostedTokenization = new window.HostedTokenization(publicSourceKey, options);

hostedTokenization
    .on('input', _onEvent)
    .on('change', _onEvent);

function _onEvent(event) {
  _handleError(event.error);
  maskedCardEl.innerText = (event.result?.maskedCard) || '';
  maskedCvv2El.innerText = (event.result?.maskedCvv2) || '';
}

/**
 *
 * @return {Promise<void>|void}
 * @private
 */
async function _onChargeClick() {
  try {
    // Get the data from the iframe
    const result = await hostedTokenization.getNonceToken();

    // Clear any errors
    _handleError();

    return _process(result);
  } catch (err) {
    return _handleError(err);
  }
}

/**
 * Send the data to the backend to process the transaction
 * @param {object} result
 * @private
 */
function _process(result) {
  const data = {
    name: nameEl.value,
    amount: parseFloat(amountEl.value),
    nonce: result.nonce,
    expiry_month: result.expiryMonth,
    expiry_year: result.expiryYear,
    // avs_zip: result.avsZip,
  };
  // fetch() ...
}

/**
 * Handle any errors send by the iframe, or clear them when resolved
 * @param {string} [error] - leave blank to clear any error messages
 * @private
 */
function _handleError(error) {
  if (error) {
    errorMessageEl.innerText = error;
    iframeContainerEl.classList.add('red-border');
  } else {
    errorMessageEl.innerText = '';
    iframeContainerEl.classList.remove('red-border');
  }
}
