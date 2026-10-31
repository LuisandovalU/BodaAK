import { defineAuth } from '@aws-amplify/backend';

/**
 * Inicio de sesión solo para la persona responsable del panel /admin.
 * Las cuentas se crean manualmente en la consola (Cognito) y se agregan
 * al grupo "admins"; los invitados nunca necesitan iniciar sesión.
 */
export const auth = defineAuth({
  loginWith: { email: true },
  groups: ['admins'],
});
