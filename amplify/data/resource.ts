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
       * Vacío = pendiente. Solo el grupo "admins" puede leerlo o cambiarlo,
       * así un invitado no puede marcarse como pagado desde el formulario.
       */
      estadoPago: a.ref('EstadoPago').authorization((allow) => [allow.group('admins')]),
    })
    .authorization((allow) => [
      // Los invitados (anónimos, con API key) solo pueden CREAR respuestas;
      // no pueden leer, editar ni borrar las de otras personas.
      allow.publicApiKey().to(['create']),
      // La persona responsable (usuario de Cognito en el grupo "admins")
      // puede ver la lista, cambiar el estado de pago y borrar duplicados.
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
