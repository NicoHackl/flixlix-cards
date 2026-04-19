import { getEntityState } from "@flixlix-cards/shared/states/utils/get-entity-state";
import { getEntityStateWatts } from "@flixlix-cards/shared/states/utils/get-entity-state-watts";
import { onlyNegative, onlyPositive } from "@flixlix-cards/shared/states/utils/negative-positive";
import { adjustZeroTolerance } from "@flixlix-cards/shared/states/tolerance/base";
import { type Battery, type FlowCardPlusConfig } from "@flixlix-cards/shared/types";
import { type HomeAssistant } from "custom-card-helpers";

export const getSingleBatteryInState = (hass: HomeAssistant, batConfig: Battery): number | null => {
  const entity = batConfig?.entity;
  if (!entity) return null;

  let state: number | null;
  if (typeof entity === "string") {
    const raw = getEntityStateWatts(hass, entity);
    state = batConfig.invert_state ? onlyPositive(raw) : onlyNegative(raw);
  } else {
    state = getEntityStateWatts(hass, entity.production);
  }

  return adjustZeroTolerance(state, batConfig.display_zero_tolerance);
};

export const getSingleBatteryOutState = (hass: HomeAssistant, batConfig: Battery): number | null => {
  const entity = batConfig?.entity;
  if (!entity) return null;

  let state: number | null;
  if (typeof entity === "string") {
    const raw = getEntityStateWatts(hass, entity);
    state = batConfig.invert_state ? onlyNegative(raw) : onlyPositive(raw);
  } else {
    state = getEntityStateWatts(hass, entity.consumption);
  }

  return adjustZeroTolerance(state, batConfig.display_zero_tolerance);
};

export const getSingleBatteryStateOfCharge = (
  hass: HomeAssistant,
  batConfig: Battery
): number | null => {
  const entity = batConfig?.state_of_charge;
  if (entity === undefined) return null;
  return getEntityState(hass, entity);
};

export const getBatteryInState = (hass: HomeAssistant, config: FlowCardPlusConfig): number | null => {
  const batteries = config.entities.battery;
  if (!batteries?.length) return null;

  return batteries.reduce<number | null>((sum, bat) => {
    const s = getSingleBatteryInState(hass, bat);
    if (s === null) return sum;
    return (sum ?? 0) + s;
  }, null);
};

export const getBatteryOutState = (hass: HomeAssistant, config: FlowCardPlusConfig): number | null => {
  const batteries = config.entities.battery;
  if (!batteries?.length) return null;

  return batteries.reduce<number | null>((sum, bat) => {
    const s = getSingleBatteryOutState(hass, bat);
    if (s === null) return sum;
    return (sum ?? 0) + s;
  }, null);
};

export const getBatteryStateOfCharge = (
  hass: HomeAssistant,
  config: FlowCardPlusConfig
): number | null => {
  const batteries = config.entities.battery;
  if (!batteries?.length) return null;
  return getSingleBatteryStateOfCharge(hass, batteries[0]);
};
