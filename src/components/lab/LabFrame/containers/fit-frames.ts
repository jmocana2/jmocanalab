/**
 * Empieza a seguir la altura del documento de un iframe y la copia en el marco.
 * @param frame Iframe de demo ya cargado.
 */
function observeFrame(frame: HTMLIFrameElement): void {
  const root = frame.contentDocument?.documentElement;

  if (!root) {
    return;
  }

  const observer = new ResizeObserver(() => {
    const height = Math.ceil(root.getBoundingClientRect().height);
    frame.style.setProperty('--frame-height', `${height}px`);
  });

  observer.observe(root);
}

/**
 * Prepara un iframe para ajustarse a su contenido, haya cargado ya o no.
 * @param frame Iframe de demo.
 */
function fitFrame(frame: HTMLIFrameElement): void {
  const frameDocument = frame.contentDocument;
  const isLoaded = frameDocument?.readyState === 'complete' && frameDocument.URL !== 'about:blank';

  if (isLoaded) {
    observeFrame(frame);
    return;
  }

  frame.addEventListener('load', () => observeFrame(frame), { once: true });
}

/**
 * Ajusta cada iframe de demo a la altura de su documento, y lo sigue si cambia, para que
 * la demo no tenga scroll propio. Las demos son del mismo origen, así que el documento
 * se lee directamente. Hasta que carga, el marco conserva la altura reservada.
 */
export function fitFrames(): void {
  document.querySelectorAll<HTMLIFrameElement>('.lab-frame').forEach(fitFrame);
}
