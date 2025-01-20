const paypal = require('@paypal/checkout-server-sdk');

function environment() {
  // Crée un environnement sandbox avec les identifiants fournis
  return new paypal.core.SandboxEnvironment(
    'AbwPVQabACjVgtIioByxEY-mN6Sx_5SiW74F3BAO23iJaIwD2yqJYFJqf5-sZIz_Dr83rmnooIeLQuJr',
    'EGd9WQicjTsQSzhqNS5oWL2zm8lFJs50mYUDtPn785ndIj-ldBUpr3-qsUJRNDxKwSHc8D7NfgxbywTs'
  );
}

function client() {
  // Crée un client PayPal en utilisant l'environnement
  return new paypal.Client(new environment());
}

module.exports = { client };
