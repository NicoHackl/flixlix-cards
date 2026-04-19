import {
  type Battery,
  type CardMainContext,
  type FlowCardPlusConfig,
} from "@flixlix-cards/shared/types";
import { displayValue } from "@flixlix-cards/shared/utils/display-value";
import { html, nothing } from "lit";

export const batteryElement = (
  main: CardMainContext,
  config: FlowCardPlusConfig,
  {
    battery,
    batteryConfig,
  }: {
    battery: any;
    batteryConfig: Battery;
  }
) => {
  const disableEntityClick = config.clickable_entities === false;

  const getClickTarget = () =>
    batteryConfig?.state_of_charge
      ? batteryConfig.state_of_charge
      : typeof batteryConfig?.entity === "string"
        ? batteryConfig.entity
        : (batteryConfig?.entity as any)?.production;

  return html`<div class="circle-container battery">
    <div
      class="circle ${disableEntityClick ? "pointer-events-none" : ""}"
      @click=${(e: MouseEvent) => main.onEntityClick(e, battery, getClickTarget())}
      @dblclick=${(e: MouseEvent) => main.onEntityDoubleClick(e, battery, getClickTarget())}
      @pointerdown=${(e: PointerEvent) => main.onEntityPointerDown(e, battery, getClickTarget())}
      @pointerup=${(e: PointerEvent) => main.onEntityPointerUp(e)}
      @pointercancel=${(e: PointerEvent) => main.onEntityPointerUp(e)}
      @keyDown=${(e: { key: string; stopPropagation: () => void; target: HTMLElement }) => {
        if (e.key === "Enter") main.openDetails(e, battery, getClickTarget(), "tap");
      }}
    >
      <ha-ripple .disabled=${disableEntityClick}></ha-ripple>
      ${battery.state_of_charge.state !== null && batteryConfig?.show_state_of_charge !== false
        ? html` <span
            @click=${(e: MouseEvent) =>
              main.onEntityClick(e, battery, batteryConfig?.state_of_charge)}
            @dblclick=${(e: MouseEvent) =>
              main.onEntityDoubleClick(e, battery, batteryConfig?.state_of_charge)}
            @pointerdown=${(e: PointerEvent) =>
              main.onEntityPointerDown(e, battery, batteryConfig?.state_of_charge)}
            @pointerup=${(e: PointerEvent) => main.onEntityPointerUp(e)}
            @pointercancel=${(e: PointerEvent) => main.onEntityPointerUp(e)}
            @keyDown=${(e: { key: string; stopPropagation: () => void; target: HTMLElement }) => {
              if (e.key === "Enter")
                main.openDetails(e, battery, batteryConfig?.state_of_charge, "tap");
            }}
            id="battery-state-of-charge-text"
          >
            ${displayValue(main.hass, config, battery.state_of_charge.state, {
              unit: battery.state_of_charge.unit ?? "%",
              unitWhiteSpace: battery.state_of_charge.unit_white_space,
              decimals: battery.state_of_charge.decimals,
              accept_negative: true,
              watt_threshold: config.watt_threshold,
            })}
          </span>`
        : nothing}
      ${battery.icon !== " "
        ? html` <ha-icon
            id="battery-icon"
            .icon=${battery.icon}
            @click=${(e: MouseEvent) =>
              main.onEntityClick(e, battery, batteryConfig?.state_of_charge)}
            @dblclick=${(e: MouseEvent) =>
              main.onEntityDoubleClick(e, battery, batteryConfig?.state_of_charge)}
            @pointerdown=${(e: PointerEvent) =>
              main.onEntityPointerDown(e, battery, batteryConfig?.state_of_charge)}
            @pointerup=${(e: PointerEvent) => main.onEntityPointerUp(e)}
            @pointercancel=${(e: PointerEvent) => main.onEntityPointerUp(e)}
            @keyDown=${(e: { key: string; stopPropagation: () => void; target: HTMLElement }) => {
              if (e.key === "Enter")
                main.openDetails(e, battery, batteryConfig?.state_of_charge, "tap");
            }}
          ></ha-icon>`
        : nothing}
      ${batteryConfig?.display_state === "two_way" ||
      batteryConfig?.display_state === undefined ||
      (batteryConfig?.display_state === "one_way_no_zero" && battery.state.toBattery > 0) ||
      (batteryConfig?.display_state === "one_way" && battery.state.toBattery !== 0)
        ? html`<span
            class="battery-in"
            @click=${(e: MouseEvent) => {
              const target =
                typeof batteryConfig!.entity === "string"
                  ? batteryConfig!.entity!
                  : (batteryConfig!.entity as any)!.production!;
              main.onEntityClick(e, batteryConfig, target);
            }}
            @dblclick=${(e: MouseEvent) => {
              const target =
                typeof batteryConfig!.entity === "string"
                  ? batteryConfig!.entity!
                  : (batteryConfig!.entity as any)!.production!;
              main.onEntityDoubleClick(e, batteryConfig, target);
            }}
            @pointerdown=${(e: PointerEvent) => {
              const target =
                typeof batteryConfig!.entity === "string"
                  ? batteryConfig!.entity!
                  : (batteryConfig!.entity as any)!.production!;
              main.onEntityPointerDown(e, batteryConfig, target);
            }}
            @pointerup=${(e: PointerEvent) => main.onEntityPointerUp(e)}
            @pointercancel=${(e: PointerEvent) => main.onEntityPointerUp(e)}
            @keyDown=${(e: { key: string; stopPropagation: () => void; target: HTMLElement }) => {
              if (e.key === "Enter") {
                const target =
                  typeof batteryConfig!.entity === "string"
                    ? batteryConfig!.entity!
                    : (batteryConfig!.entity as any)!.production!;
                main.openDetails(e, batteryConfig, target, "tap");
              }
            }}
          >
            <ha-icon class="small" .icon=${"mdi:arrow-down"}></ha-icon>
            ${displayValue(main.hass, config, battery.state.toBattery, {
              unit: battery.unit,
              unitWhiteSpace: battery.unit_white_space,
              decimals: battery.decimals,
              watt_threshold: config.watt_threshold,
            })}</span
          >`
        : nothing}
      ${batteryConfig?.display_state === "two_way" ||
      batteryConfig?.display_state === undefined ||
      (batteryConfig?.display_state === "one_way_no_zero" && battery.state.fromBattery > 0) ||
      (batteryConfig?.display_state === "one_way" &&
        (battery.state.toBattery === 0 || battery.state.fromBattery !== 0))
        ? html`<span
            class="battery-out"
            @click=${(e: MouseEvent) => {
              const target =
                typeof batteryConfig!.entity === "string"
                  ? batteryConfig!.entity!
                  : (batteryConfig!.entity as any)!.consumption!;
              main.onEntityClick(e, batteryConfig, target);
            }}
            @dblclick=${(e: MouseEvent) => {
              const target =
                typeof batteryConfig!.entity === "string"
                  ? batteryConfig!.entity!
                  : (batteryConfig!.entity as any)!.consumption!;
              main.onEntityDoubleClick(e, batteryConfig, target);
            }}
            @pointerdown=${(e: PointerEvent) => {
              const target =
                typeof batteryConfig!.entity === "string"
                  ? batteryConfig!.entity!
                  : (batteryConfig!.entity as any)!.consumption!;
              main.onEntityPointerDown(e, batteryConfig, target);
            }}
            @pointerup=${(e: PointerEvent) => main.onEntityPointerUp(e)}
            @pointercancel=${(e: PointerEvent) => main.onEntityPointerUp(e)}
            @keyDown=${(e: { key: string; stopPropagation: () => void; target: HTMLElement }) => {
              if (e.key === "Enter") {
                const target =
                  typeof batteryConfig!.entity === "string"
                    ? batteryConfig!.entity!
                    : (batteryConfig!.entity as any)!.consumption!;
                main.openDetails(e, batteryConfig, target, "tap");
              }
            }}
          >
            <ha-icon class="small" .icon=${"mdi:arrow-up"}></ha-icon>
            ${displayValue(main.hass, config, battery.state.fromBattery, {
              unit: battery.unit,
              unitWhiteSpace: battery.unit_white_space,
              decimals: battery.decimals,
              watt_threshold: config.watt_threshold,
            })}</span
          >`
        : nothing}
    </div>
    <span class="label">${battery.name}</span>
  </div>`;
};
