import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Esquema de datos de la boda. Amplify crea automáticamente una tabla de
 * DynamoDB por cada modelo y una API GraphQL (AppSync) para acceder a ella.
 */
const schema = a.schema({
  RSVP: a
    .model({
      /** Nombre completo (nombres + apellidos), se conserva por compatibilidad. */
      nombre: a.string().required(),
      nombres: a.string().required(),
      apellidos: a.string().required(),
      asistencia: a.enum(['si', 'no']),
      grupo: a.string(),
    })
    // Los invitados (anónimos, con API key) solo pueden CREAR respuestas;
    // no pueden leer, editar ni borrar las de otras personas.
    .authorization((allow) => [allow.publicApiKey().to(['create'])]),
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
