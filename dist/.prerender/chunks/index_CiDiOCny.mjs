import { M as InvalidComponentArgs, S as createAstro, Y as AstroError, a as renderComponent, c as renderSlot, d as renderTemplate, f as maybeRenderHead, h as createRenderInstruction, m as addAttribute, p as renderHead } from "./server_CcV0dun3.mjs";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/astro/dist/runtime/server/astro-component.js
function validateArgs(args) {
	if (args.length !== 3) return false;
	if (!args[0] || typeof args[0] !== "object") return false;
	return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
	const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
	const fn = (...args) => {
		if (!validateArgs(args)) throw new AstroError({
			...InvalidComponentArgs,
			message: InvalidComponentArgs.message(name)
		});
		return cb(...args);
	};
	Object.defineProperty(fn, "name", {
		value: name,
		writable: false
	});
	fn.isAstroComponentFactory = true;
	fn.moduleId = moduleId;
	fn.propagation = propagation;
	return fn;
}
function createComponentWithOptions(opts) {
	return baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
}
function createComponent(arg1, moduleId, propagation) {
	if (typeof arg1 === "function") return baseCreateComponent(arg1, moduleId, propagation);
	else return createComponentWithOptions(arg1);
}
//#endregion
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title = "Ángel & Kenia — Nuestra Boda · 04.04.27", description = "Con la bendición de Dios y el amor que nos une, te invitamos a celebrar nuestra boda. Domingo 04 de abril 2027, Salón Bamboo." } = Astro.props;
	return renderTemplate`<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><meta name="theme-color" content="#f5f0e8"><link rel="icon" type="image/png" href="/images/monograma.png"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:type" content="website"><meta property="og:image" content="/images/photo-rsvp.jpg">${renderHead($$result)}</head><body><div class="app-shell"><main class="mobile-card">${renderSlot($$result, $$slots["default"])}</main></div></body></html>`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/layouts/Layout.astro", void 0);
//#endregion
//#region src/components/Hero.astro
var $$Hero = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`import SaveDateTitle from "./SaveDateTitle.astro";${maybeRenderHead($$result)}<section class="hero" id="save-the-date" aria-label="Save the date de Angel y Kenia" data-astro-cid-ge2uvauf><!-- Flor superior izquierda --><img src="/images/flower-top-left.png" alt="" aria-hidden="true" class="flor flor--tl floating-flower" data-astro-cid-ge2uvauf><!-- Flor superior derecha (espejada para simetría) --><img src="/images/flower-top-right.png" alt="" aria-hidden="true" class="flor flor--tr floating-flower" style="--float-delay: 1s;" data-astro-cid-ge2uvauf><div class="hero__inner" data-astro-cid-ge2uvauf><!-- Monograma --><img src="/images/monograma.png" alt="Monograma de Angel y Kenia" class="monograma" fetchpriority="high" data-astro-cid-ge2uvauf><!-- Marco ornamental y textos principales --><div class="marco" data-astro-cid-ge2uvauf><img src="/images/marco-tl.png" alt="" aria-hidden="true" class="esq esq--tl" data-astro-cid-ge2uvauf><img src="/images/marco-tr.png" alt="" aria-hidden="true" class="esq esq--tr" data-astro-cid-ge2uvauf><img src="/images/marco-bl.png" alt="" aria-hidden="true" class="esq esq--bl" data-astro-cid-ge2uvauf><img src="/images/marco-br.png" alt="" aria-hidden="true" class="esq esq--br" data-astro-cid-ge2uvauf>${renderComponent($$result, "SaveDateTitle", SaveDateTitle, { "data-astro-cid-ge2uvauf": true })}<p class="fecha" data-astro-cid-ge2uvauf>04.04.27</p><p class="versiculo" data-astro-cid-ge2uvauf>1 Corintios 13:13</p></div><!-- Peonía inferior integrada --><img src="/images/flower-peony.png" alt="" aria-hidden="true" class="peonia floating-flower" style="--float-delay: 1.6s;" data-astro-cid-ge2uvauf><!-- Información de fecha y lugar --><div class="evento" data-astro-cid-ge2uvauf><p class="evento__fecha" data-astro-cid-ge2uvauf>Domingo 04 | Abril 2027</p><p class="evento__hora" data-astro-cid-ge2uvauf>15:30 HRS</p><p class="evento__lugar" data-astro-cid-ge2uvauf>Salón Bamboo</p></div></div></section>`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/Hero.astro", void 0);
//#endregion
//#region src/components/S2_Names.astro
var $$S2Names = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="bloque relative overflow-hidden" id="nombres" style="padding: 2.5rem 1.4rem 3rem;" data-astro-cid-hbhfb4ra><!-- Ramo lateral decorativo flotante --><div class="absolute -right-6 top-16 w-28 opacity-75 pointer-events-none select-none" data-astro-cid-hbhfb4ra><img src="/assets/ramo_vertical_lateral.webp" alt="" class="w-full h-auto" data-astro-cid-hbhfb4ra></div><div class="relative z-10" data-astro-cid-hbhfb4ra><!-- Nombres en caligrafía original --><div class="my-6 flex justify-center" data-astro-cid-hbhfb4ra><img src="/assets/nombres_angel_y_kenia.webp" alt="Ángel y Kenia" class="w-full max-w-[320px] h-auto object-contain select-none" data-astro-cid-hbhfb4ra></div><!-- Cuenta regresiva --><div class="mt-8 mb-4" data-astro-cid-hbhfb4ra><p class="font-serif italic text-base text-[#263875] tracking-widest mb-1" data-astro-cid-hbhfb4ra>the countdown</p><p class="font-script text-3xl text-[#263875] mb-4" data-astro-cid-hbhfb4ra>Forever begins in</p><div id="countdown" data-fecha="2027-04-04T15:30:00-06:00" class="grid grid-cols-4 gap-2.5 max-w-[320px] mx-auto" data-astro-cid-hbhfb4ra><div class="flex flex-col items-center" data-astro-cid-hbhfb4ra><div id="cd-d" class="w-full bg-[#526f9d] text-white font-serif font-bold text-2xl py-3" data-astro-cid-hbhfb4ra>00</div><span class="font-serif text-xs text-[#263875] mt-1.5 uppercase tracking-wider font-semibold" data-astro-cid-hbhfb4ra>Días</span></div><div class="flex flex-col items-center" data-astro-cid-hbhfb4ra><div id="cd-h" class="w-full bg-[#526f9d] text-white font-serif font-bold text-2xl py-3" data-astro-cid-hbhfb4ra>00</div><span class="font-serif text-xs text-[#263875] mt-1.5 uppercase tracking-wider font-semibold" data-astro-cid-hbhfb4ra>Horas</span></div><div class="flex flex-col items-center" data-astro-cid-hbhfb4ra><div id="cd-m" class="w-full bg-[#526f9d] text-white font-serif font-bold text-2xl py-3" data-astro-cid-hbhfb4ra>00</div><span class="font-serif text-xs text-[#263875] mt-1.5 uppercase tracking-wider font-semibold" data-astro-cid-hbhfb4ra>Minutos</span></div><div class="flex flex-col items-center" data-astro-cid-hbhfb4ra><div id="cd-s" class="w-full bg-[#526f9d] text-white font-serif font-bold text-2xl py-3" data-astro-cid-hbhfb4ra>00</div><span class="font-serif text-xs text-[#263875] mt-1.5 uppercase tracking-wider font-semibold" data-astro-cid-hbhfb4ra>Segundos</span></div></div></div><!-- Cita bíblica --><div class="my-8 px-4" data-astro-cid-hbhfb4ra><p class="font-serif italic text-base text-[#263875] leading-relaxed max-w-[32ch] mx-auto" data-astro-cid-hbhfb4ra>“Ahora, pues, permanecen la fe, la esperanza y el amor. Pero el amor es el más importante.”</p><p class="font-serif text-sm text-[#263875] tracking-widest mt-2 uppercase font-medium" data-astro-cid-hbhfb4ra>1 Corintios 13:13</p></div><!-- Fotografía de manos y anillos del diseño de referencia --><div class="foto-compromiso relative mx-auto max-w-[340px] overflow-hidden" data-astro-cid-hbhfb4ra><img src="/assets/foto_anillos.webp" alt="Manos de Ángel y Kenia con sus anillos" class="block w-full h-auto object-cover" data-astro-cid-hbhfb4ra></div></div></section>${renderScript($$result, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/S2_Names.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/S2_Names.astro", void 0);
//#endregion
//#region src/components/Detalles.astro
var $$Detalles = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="seccion detalles" id="detalles" data-astro-cid-dgathxsw><h2 class="titulo-seccion" data-astro-cid-dgathxsw>Detalles</h2><div class="momentos" data-astro-cid-dgathxsw>${[
		{
			icono: "/images/icon-detalles-llegada.png",
			nombre: "Llegada",
			hora: "3:30PM"
		},
		{
			icono: "/images/icon-detalles-ceremonia.png",
			nombre: "Ceremonia",
			hora: "3:45PM"
		},
		{
			icono: "/images/icon-detalles-fiesta.png",
			nombre: "Fiesta",
			hora: "5:00PM"
		},
		{
			icono: "/images/icon-detalles-salida.png",
			nombre: "Salida",
			hora: "11:00PM"
		}
	].map((m) => renderTemplate`<div class="momento" data-astro-cid-dgathxsw><img${addAttribute(m.icono, "src")} alt="" aria-hidden="true" class="momento__icono" loading="lazy" data-astro-cid-dgathxsw><span class="momento__nombre" data-astro-cid-dgathxsw>${m.nombre}</span><span class="momento__hora" data-astro-cid-dgathxsw>${m.hora}</span></div>`)}</div></section>`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/Detalles.astro", void 0);
//#endregion
//#region src/components/DressCode.astro
var $$DressCode = createComponent(($$result, $$props, $$slots) => {
	const sugeridos = [
		{
			hex: "#D4A05A",
			nombre: "Dorado"
		},
		{
			hex: "#C9A0C9",
			nombre: "Rosa"
		},
		{
			hex: "#7B6FBF",
			nombre: "Lavanda"
		},
		{
			hex: "#F0E04A",
			nombre: "Mostaza"
		},
		{
			hex: "#5A6B35",
			nombre: "Verde oliva"
		},
		{
			hex: "#111111",
			nombre: "Negro"
		},
		{
			hex: "#5B3A1A",
			nombre: "Café"
		},
		{
			hex: "#7A7D6A",
			nombre: "Gris"
		},
		{
			hex: "#8B5E34",
			nombre: "Bronce"
		}
	];
	return renderTemplate`${maybeRenderHead($$result)}<section class="seccion dresscode" id="dress-code" data-astro-cid-xrveazn7><!-- ============ Recuadro: la única zona con color sólido ============ --><div class="recuadro" data-astro-cid-xrveazn7><img src="/images/dresscode-corner-1.png" alt="" aria-hidden="true" class="recuadro__esquina recuadro__esquina--tl" data-astro-cid-xrveazn7><img src="/images/dresscode-corner-2.png" alt="" aria-hidden="true" class="recuadro__esquina recuadro__esquina--tr" data-astro-cid-xrveazn7><img src="/images/dresscode-corner-2.png" alt="" aria-hidden="true" class="recuadro__esquina recuadro__esquina--bl" data-astro-cid-xrveazn7><img src="/images/dresscode-corner-1.png" alt="" aria-hidden="true" class="recuadro__esquina recuadro__esquina--br" data-astro-cid-xrveazn7><h2 class="recuadro__titulo" data-astro-cid-xrveazn7>Dress Code</h2><p class="recuadro__gala" data-astro-cid-xrveazn7>Gala</p><div class="siluetas" data-astro-cid-xrveazn7><figure class="silueta" data-astro-cid-xrveazn7><figcaption data-astro-cid-xrveazn7>Mujeres</figcaption><img src="/images/dresscode-women.png" alt="Silueta de vestido de gala" loading="lazy" data-astro-cid-xrveazn7></figure><figure class="silueta" data-astro-cid-xrveazn7><figcaption data-astro-cid-xrveazn7>Hombres</figcaption><img src="/images/dresscode-men.png" alt="Silueta de traje de gala" loading="lazy" data-astro-cid-xrveazn7></figure></div></div><!-- ============ Colores sugeridos (etiqueta debajo) ============ --><ul class="paleta" aria-label="Colores sugeridos" data-astro-cid-xrveazn7>${sugeridos.slice(0, 5).map((c) => renderTemplate`<li class="color"${addAttribute(`--c: ${c.hex}`, "style")}${addAttribute(c.nombre, "title")} data-astro-cid-xrveazn7></li>`)}<li class="paleta__separador" aria-hidden="true" data-astro-cid-xrveazn7></li>${sugeridos.slice(5).map((c) => renderTemplate`<li class="color"${addAttribute(`--c: ${c.hex}`, "style")}${addAttribute(c.nombre, "title")} data-astro-cid-xrveazn7></li>`)}</ul><p class="paleta__etiqueta" data-astro-cid-xrveazn7>Colores sugeridos</p><!-- ============ Colores reservados (una línea roja los cruza) ============ --><ul class="paleta paleta--no" aria-label="Colores para no utilizar" data-astro-cid-xrveazn7>${[
		{
			hex: "#1E2A38",
			nombre: "Azul marino"
		},
		{
			hex: "#4A5F7F",
			nombre: "Azul principal"
		},
		{
			hex: "#8FA0C0",
			nombre: "Azul acero"
		},
		{
			hex: "#C5D5E8",
			nombre: "Azul claro"
		},
		{
			hex: "#E8DCC8",
			nombre: "Nude"
		},
		{
			hex: "#FFFFFF",
			nombre: "Blanco"
		}
	].map((c) => renderTemplate`<li class="color"${addAttribute(`--c: ${c.hex}`, "style")}${addAttribute(c.nombre, "title")} data-astro-cid-xrveazn7></li>`)}<li class="paleta__tachado" aria-hidden="true" data-astro-cid-xrveazn7></li></ul><p class="aviso" data-astro-cid-xrveazn7>Colores para no utilizar este día. Serán los colores de la novia, el novio, damas y caballeros de honor.</p></section>`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/DressCode.astro", void 0);
//#endregion
//#region src/components/Gifts.astro
var $$Gifts = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="seccion regalos" id="regalos" data-astro-cid-oqayabyz><h2 class="titulo-seccion" data-astro-cid-oqayabyz>Regalos</h2><p class="texto texto--principal" data-astro-cid-oqayabyz>Su presencia es, sin duda, el mejor regalo que podríamos recibir. Si desean acompañarnos con un detalle, pueden hacerlo mediante <em data-astro-cid-oqayabyz>transferencia</em> o, si lo prefieren, también será bien recibido un sobre en <em data-astro-cid-oqayabyz>efectivo</em> el día de la celebración.</p><!-- ===================== Datos bancarios sobre el papel ===================== --><div class="datos" data-astro-cid-oqayabyz><img src="/images/regalo-mono.png" alt="" aria-hidden="true" class="ornato ornato--mono floating-flower" data-astro-cid-oqayabyz><img src="/images/regalo-cajas.png" alt="" aria-hidden="true" class="ornato ornato--cajas floating-flower" style="--float-delay: 1.4s" data-astro-cid-oqayabyz><ul class="datos__lista" data-astro-cid-oqayabyz><li class="dato" data-astro-cid-oqayabyz><span class="dato__label" data-astro-cid-oqayabyz>CLABE:</span>${" "}<span class="dato__valor mono" data-astro-cid-oqayabyz>${"638180010146605599"}</span>${" "}<button type="button" id="btn-copiar-clabe" class="btn-copiar-icono" aria-label="Copiar CLABE" title="Copiar CLABE" data-astro-cid-oqayabyz><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-oqayabyz><rect x="9" y="9" width="13" height="13" rx="2" data-astro-cid-oqayabyz></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" data-astro-cid-oqayabyz></path></svg></button></li><li class="dato" data-astro-cid-oqayabyz><span class="dato__label" data-astro-cid-oqayabyz>Nombre:</span> <span class="dato__valor" data-astro-cid-oqayabyz>Ángel Adrián Zamora Morales</span></li><li class="dato" data-astro-cid-oqayabyz><span class="dato__label" data-astro-cid-oqayabyz>Banco:</span> <span class="dato__valor" data-astro-cid-oqayabyz>NU</span></li><li class="dato" data-astro-cid-oqayabyz><span class="dato__label" data-astro-cid-oqayabyz>Concepto:</span> <span class="dato__valor" data-astro-cid-oqayabyz>BODA</span></li></ul><p id="copiado-msg" class="copiado" role="status" aria-live="polite" data-astro-cid-oqayabyz></p></div><p class="despedida" data-astro-cid-oqayabyz>Agradecemos de corazón cada muestra de cariño.</p></section>${renderScript($$result, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/Gifts.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/Gifts.astro", void 0);
//#endregion
//#region src/components/S5_Ubicacion.astro
var $$S5Ubicacion = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="bloque relative overflow-hidden" id="ubicacion" style="padding: 2.5rem 1.4rem 3rem;"><h2 class="font-script text-4xl sm:text-5xl text-[#263875] mb-2">Ubicación</h2><p class="font-serif text-[#263875] text-2xl font-semibold m-0 tracking-wide">Salón Bamboo</p><p class="font-serif text-[#263875] text-sm max-w-[32ch] mx-auto mt-2 mb-5 leading-relaxed">C. Benito Juárez 36, Tlacoapa, Xochimilco, 16000 Ciudad de México, CDMX</p><a${addAttribute("https://www.google.com/maps/search/?api=1&query=C.+Benito+Ju%C3%A1rez+36,+Tlacoapa,+Xochimilco,+16000+CDMX", "href")} target="_blank" rel="noreferrer" class="font-serif text-[#263875] text-base underline underline-offset-2">Link</a></section>`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/S5_Ubicacion.astro", void 0);
//#endregion
//#region src/components/Monograma.astro
var $$Monograma = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="seccion monograma" id="monograma" aria-label="Monograma de Angel y Kenia" data-astro-cid-hjjoe6gl><img src="/images/monograma.png" alt="Monograma de Angel y Kenia" class="monograma__imagen" loading="lazy" data-astro-cid-hjjoe6gl></section>`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/Monograma.astro", void 0);
//#endregion
//#region src/components/S8_Galeria.astro
var $$S8Galeria = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="seccion galeria" id="galeria" data-astro-cid-olwdesiq><div class="galeria-fotos" aria-label="Fotografías de Ángel y Kenia" data-astro-cid-olwdesiq>${[
		{
			src: "/assets/foto_pareja_espaldas.webp",
			alt: "Ángel y Kenia abrazados de espaldas",
			clase: "foto-espaldas"
		},
		{
			src: "/assets/foto_pareja_baile.webp",
			alt: "Ángel y Kenia bailando juntos",
			clase: "foto-baile"
		},
		{
			src: "/assets/foto_pareja_sonrisa.webp",
			alt: "Ángel y Kenia sonriendo durante su sesión",
			clase: "foto-sonrisa"
		}
	].map((f) => renderTemplate`<figure${addAttribute(`foto ${f.clase}`, "class")} data-astro-cid-olwdesiq><img class="marco-esq marco-esq--tl" src="/images/marco-tl.png" alt="" aria-hidden="true" data-astro-cid-olwdesiq><img class="marco-esq marco-esq--tr" src="/images/marco-tr.png" alt="" aria-hidden="true" data-astro-cid-olwdesiq><img class="marco-esq marco-esq--bl" src="/images/marco-bl.png" alt="" aria-hidden="true" data-astro-cid-olwdesiq><img class="marco-esq marco-esq--br" src="/images/marco-br.png" alt="" aria-hidden="true" data-astro-cid-olwdesiq><img class="foto__imagen"${addAttribute(f.src, "src")}${addAttribute(f.alt, "alt")} loading="lazy" data-astro-cid-olwdesiq></figure>`)}</div></section>`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/S8_Galeria.astro", void 0);
//#endregion
//#region src/components/RSVP.astro
var $$RSVP = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="seccion rsvp" id="rsvp" data-astro-cid-77yh3ajl><img src="/images/flower-side-right.png" alt="" aria-hidden="true" class="flor-lateral floating-flower" data-astro-cid-77yh3ajl><!-- Título como en el PDF: "CONFIRMACIÓN DE" en serif + "asistencia" en script --><p class="confirmacion-caps" data-astro-cid-77yh3ajl>Confirmación de</p><h2 class="titulo-seccion" data-astro-cid-77yh3ajl>asistencia</h2><p class="intro" data-astro-cid-77yh3ajl>15 de diciembre de 2026. Su confirmación nos ayudará a preparar cada detalle con el cariño y cuidado que esta celebración merece.</p><!-- ===================== Paso 1: confirmar ===================== --><form id="rsvp-form" class="formulario" novalidate data-astro-cid-77yh3ajl><label class="campo" data-astro-cid-77yh3ajl><span class="campo__label" data-astro-cid-77yh3ajl>Nombre completo</span><input id="rsvp-nombre" name="nombre" type="text" autocomplete="name" placeholder="Escribe tu nombre completo" required data-astro-cid-77yh3ajl></label><label class="campo" data-astro-cid-77yh3ajl><span class="campo__label" data-astro-cid-77yh3ajl>Número de adultos</span><input id="rsvp-adultos" name="adultos" type="number" min="1" max="10" value="1" required data-astro-cid-77yh3ajl></label><p id="rsvp-error" class="error" role="alert" aria-live="polite" data-astro-cid-77yh3ajl></p><button type="submit" class="btn-primario" data-astro-cid-77yh3ajl>Confirmar</button></form><!-- ===================== Paso 2: resultado ===================== --><div id="rsvp-result" class="resultado" hidden data-astro-cid-77yh3ajl><p class="gracias" data-astro-cid-77yh3ajl>¡Gracias por tu confirmación!</p><p class="pregunta" data-astro-cid-77yh3ajl>Cuéntanos cómo nos acompañas:</p><div class="tipos" role="group" aria-label="Tipo de invitado" data-astro-cid-77yh3ajl><button type="button" class="btn-tipo" data-tipo="familiar" aria-pressed="false" data-astro-cid-77yh3ajl>Soy familiar de Angel y Kenia</button><button type="button" class="btn-tipo" data-tipo="amistad" aria-pressed="false" data-astro-cid-77yh3ajl>Soy amistad de Angel y Kenia</button></div><!-- Familiar: SOLO el mensaje final --><div id="rsvp-panel-familiar" class="panel" hidden data-astro-cid-77yh3ajl><p class="nos-vemos" data-astro-cid-77yh3ajl>¡NOS VEMOS ESE DÍA!</p></div><!-- Amistad: datos bancarios + comprobante + mensaje final --><div id="rsvp-panel-amistad" class="panel" hidden data-astro-cid-77yh3ajl><div class="banco" data-astro-cid-77yh3ajl><p class="dato" data-astro-cid-77yh3ajl>CLABE: 0000 0000 0000 0000</p><p class="dato" data-astro-cid-77yh3ajl>Nombre: asdfghjkl</p><p class="dato" data-astro-cid-77yh3ajl>Banco:</p></div><p class="enviar" data-astro-cid-77yh3ajl>Envía tu comprobante a</p><p class="nos-vemos" data-astro-cid-77yh3ajl>¡NOS VEMOS ESE DÍA!</p></div></div></section>${renderScript($$result, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/RSVP.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/RSVP.astro", void 0);
//#endregion
//#region src/components/ImportantNotes.astro
var $$ImportantNotes = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="seccion importante" id="importante" data-astro-cid-orvbs7lc><h2 class="titulo-seccion" data-astro-cid-orvbs7lc>Importante</h2><ol class="avisos" data-astro-cid-orvbs7lc>${[
		{
			icono: "/images/icon-adults.png",
			titulo: "FIESTA PARA ADULTOS:",
			texto: "Amamos a los niños pero es un evento para adultos, agradecemos tu comprensión para dejarlos en casa."
		},
		{
			icono: "/images/icon-parking.png",
			titulo: "VALET PARKING $70:",
			texto: "No hay estacionamiento."
		},
		{
			icono: "/images/icon-taylor.png",
			titulo: "MOMENTO ESPECIAL:",
			texto: "Conocer de memoria la letra de Love Story de Taylor Swift."
		},
		{
			icono: "/images/icon-heart.png",
			titulo: "INVITACIÓN INTRANSFERIBLE:",
			texto: "Tu boleto e invitación es personal. Gracias."
		}
	].map((a) => renderTemplate`<li class="aviso" data-astro-cid-orvbs7lc><span class="aviso__icono" data-astro-cid-orvbs7lc><img${addAttribute(a.icono, "src")} alt="" aria-hidden="true" loading="lazy" data-astro-cid-orvbs7lc></span><span class="aviso__cuerpo" data-astro-cid-orvbs7lc><strong class="aviso__titulo" data-astro-cid-orvbs7lc>${a.titulo}</strong>${" "}<span class="aviso__texto" data-astro-cid-orvbs7lc>${a.texto}</span></span></li>`)}</ol></section>`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/ImportantNotes.astro", void 0);
//#endregion
//#region src/components/FotoFinal.astro
var $$FotoFinal = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<section class="foto-final" aria-label="Ángel y Kenia caminando juntos" data-astro-cid-narnx3z6><img class="foto-final__imagen" src="/assets/foto_pareja_entrada.webp" alt="Ángel y Kenia caminando juntos por un jardín" loading="lazy" data-astro-cid-narnx3z6><img class="foto-final__nombres" src="/assets/nombres_angel_y_kenia.webp" alt="Ángel y Kenia" loading="lazy" data-astro-cid-narnx3z6></section>`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/components/FotoFinal.astro", void 0);
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Hero", $$Hero, {})}${renderComponent($$result, "S2Names", $$S2Names, {})}${renderComponent($$result, "Detalles", $$Detalles, {})}${renderComponent($$result, "DressCode", $$DressCode, {})}${renderComponent($$result, "Gifts", $$Gifts, {})}${renderComponent($$result, "S5Ubicacion", $$S5Ubicacion, {})}${renderComponent($$result, "Monograma", $$Monograma, {})}${renderComponent($$result, "S8Galeria", $$S8Galeria, {})}${renderComponent($$result, "RSVP", $$RSVP, {})}${renderComponent($$result, "ImportantNotes", $$ImportantNotes, {})}${renderComponent($$result, "FotoFinal", $$FotoFinal, {})}` })}`;
}, "/Users/luisalbertosandovalramos/Documents/BodaAK/src/pages/index.astro", void 0);
var $$file = "/Users/luisalbertosandovalramos/Documents/BodaAK/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
