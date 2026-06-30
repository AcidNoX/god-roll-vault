/** Bungie `DestinyItemState` bit flags used for weapon tiles. */
export const DESTINY_ITEM_STATE_MASTERWORK = 4;
export const DESTINY_ITEM_STATE_CRAFTED = 8;
export const DESTINY_ITEM_STATE_HAS_SHINY = 4_194_304;

export function hasItemStateFlag(state: number | undefined, flag: number): boolean {
  if (!state) {
    return false;
  }

  return (state & flag) === flag;
}
