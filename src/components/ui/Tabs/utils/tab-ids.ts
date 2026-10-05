/**
 * Construye los id que enlazan una pestaña con su panel (`aria-controls` y
 * `aria-labelledby`). Los usan `Tabs` y `TabPanel`, así que no pueden divergir.
 * @param tabsId Id del grupo de pestañas, único en la página.
 * @param tabId Id de la pestaña dentro del grupo.
 * @returns El id del botón de la pestaña y el de su panel.
 */
export function tabIds(tabsId: string, tabId: string): { tab: string; panel: string } {
  return { tab: `${tabsId}-tab-${tabId}`, panel: `${tabsId}-panel-${tabId}` };
}
