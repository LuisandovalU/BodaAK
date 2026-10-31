import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

/**
 * `amplify_outputs.json` lo genera Amplify durante el deploy (o `npx ampx sandbox`
 * en local). Se carga de forma opcional para que el sitio compile aunque aún
 * no exista el backend.
 */
const outputsModules = import.meta.glob<{ default: Record<string, unknown> }>(
  '../../amplify_outputs.json',
  { eager: true },
);
const outputs = Object.values(outputsModules)[0]?.default;

let client: ReturnType<typeof generateClient<Schema>> | undefined;

function getClient() {
  if (!outputs) return undefined;
  if (!client) {
    Amplify.configure(outputs);
    client = generateClient<Schema>({ authMode: 'apiKey' });
  }
  return client;
}

export interface RSVPData {
  /** Nombre completo (nombres + apellidos), se conserva por compatibilidad. */
  nombre: string;
  nombres: string;
  apellidos: string;
  asistencia: 'si' | 'no';
  grupo?: 'familia' | 'amistad' | '';
}

export async function submitRSVP(data: RSVPData): Promise<string> {
  const api = getClient();
  // Sin backend de AWS configurado: guardado local como fallback para no bloquear la UX
  if (!api) {
    const key = `rsvp-local-${Date.now()}`;
    try {
      localStorage.setItem(key, JSON.stringify({ ...data, createdAt: new Date().toISOString() }));
    } catch { /* noop */ }
    await new Promise((r) => setTimeout(r, 600));
    return key;
  }
  const { data: created, errors } = await api.models.RSVP.create(
    { ...data, grupo: data.grupo || null },
    // Solo se permite "create" a invitados: pedimos únicamente el id de vuelta.
    { selectionSet: ['id'] },
  );
  if (errors?.length || !created) {
    throw new Error(errors?.map((e) => e.message).join('; ') || 'No se pudo guardar el RSVP');
  }
  return created.id;
}
