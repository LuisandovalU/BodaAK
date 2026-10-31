import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Esquema de datos de la boda. Amplify crea automáticamente una tabla de
 * DynamoDB por cada modelo y una API GraphQL (AppSync) para acceder a ella.
 */
const schema = a.schema({
  EstadoPago: a.enum(['pendiente', 'pagado']),
  RSVP: a
    .model({
      /** Nombre completo (nombres + apellidos), se conserva por compatibilidad. */
      nombre: a.string().required(),
      nombres: a.string().required(),
      apellidos: a.string().required(),
      asistencia: a.enum(['si', 'no']),
      grupo: a.string(),
      /**
       * Estado del pago del boleto (solo aplica a "amistad").
       * Vacío = pendiente. Cualquier usuario autenticado en /admin puede
       * leerlo y cambiarlo; un invitado anónimo no puede tocarlo.
       */
      estadoPago: a
        .ref('EstadoPago')
        .authorization((allow) => [allow.authenticated(), allow.group('admins')]),
    })
    .authorization((allow) => [
      // Los invitados (anónimos, con API key) solo pueden CREAR respuestas;
      // no pueden leer, editar ni borrar las de otras personas.
      allow.publicApiKey().to(['create']),
      // Cualquier usuario creado en Cognito puede usar el panel /admin
      // sin necesidad de configurar grupos manualmente.
      allow.authenticated().to(['read', 'update', 'delete']),
      allow.group('admins').to(['read', 'update', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    // Máximo permitido por AppSync; cubre todo el periodo de confirmaciones.
    apiKeyAuthorizationMode: { expiresInDays: 365 },
  },
});
