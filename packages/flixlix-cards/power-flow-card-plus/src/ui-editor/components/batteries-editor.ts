import localize from "@flixlix-cards/shared/i18n";
import { type Battery, type PowerFlowCardPlusConfig } from "@flixlix-cards/shared/types";
import { mdiArrowLeft, mdiDelete, mdiPencil, mdiPlusCircle } from "@mdi/js";
import { fireEvent, type HomeAssistant } from "custom-card-helpers";
import { css, type CSSResultGroup, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { batterySchema } from "../schema/battery";

const MAX_BATTERIES = 5;

@customElement("batteries-editor")
export class BatteriesEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: PowerFlowCardPlusConfig;

  @state() private _editingIndex: number = -1;

  protected render(): TemplateResult {
    if (!this.config || !this.hass) {
      return html`<div>no config</div>`;
    }

    const batteries: Battery[] = this.config.entities.battery ?? [];

    if (this._editingIndex !== -1) {
      const bat = batteries[this._editingIndex] ?? {};
      return html`
        <div class="edit-header">
          <ha-icon-button
            .label=${"Back"}
            @click=${() => {
              this._editingIndex = -1;
            }}
          >
            <ha-svg-icon .path=${mdiArrowLeft}></ha-svg-icon>
          </ha-icon-button>
          <span>${localize("editor.battery")} ${this._editingIndex + 1}</span>
        </div>
        <ha-form
          .hass=${this.hass}
          .data=${bat}
          .schema=${batterySchema}
          .computeLabel=${this._computeLabelCallback}
          @value-changed=${this._batteryChanged}
        ></ha-form>
      `;
    }

    return html`
      <div class="battery-list">
        ${batteries.length === 0
          ? html`<p class="empty-hint">${localize("editor.no_batteries_configured")}</p>`
          : batteries.map(
              (bat, i) => html`
                <div class="battery-row">
                  <ha-svg-icon class="battery-icon" .path=${"M12,20H4V6H13V4H4C2.89,4 2,4.89 2,6V20A2,2 0 0,0 4,22H12V20M15,4V6H18V18H15V20H18A2,2 0 0,0 20,18V6C20,4.89 19.1,4 18,4H15M13,9V11H3V9H13M13,13V15H3V13H13Z"}></ha-svg-icon>
                  <span class="battery-name"
                    >${bat.name ?? `${localize("editor.battery")} ${i + 1}`}</span
                  >
                  <ha-icon-button
                    .label=${"Edit"}
                    @click=${() => {
                      this._editingIndex = i;
                    }}
                  >
                    <ha-svg-icon .path=${mdiPencil}></ha-svg-icon>
                  </ha-icon-button>
                  <ha-icon-button
                    .label=${"Remove"}
                    @click=${() => this._removeBattery(i)}
                  >
                    <ha-svg-icon .path=${mdiDelete}></ha-svg-icon>
                  </ha-icon-button>
                </div>
              `
            )}
      </div>
      ${batteries.length < MAX_BATTERIES
        ? html`
            <div class="add-row">
              <ha-icon-button .label=${"Add Battery"} @click=${this._addBattery}>
                <ha-svg-icon .path=${mdiPlusCircle}></ha-svg-icon>
              </ha-icon-button>
              <span @click=${this._addBattery}>${localize("editor.add_battery")}</span>
            </div>
          `
        : nothing}
    `;
  }

  private _addBattery(): void {
    const batteries = [...(this.config.entities.battery ?? []), {} as Battery];
    this._fireChanged(batteries);
    this._editingIndex = batteries.length - 1;
  }

  private _removeBattery(index: number): void {
    const batteries = (this.config.entities.battery ?? []).filter((_, i) => i !== index);
    this._fireChanged(batteries);
  }

  private _batteryChanged(ev: CustomEvent): void {
    const batteries = [...(this.config.entities.battery ?? [])];
    batteries[this._editingIndex] = ev.detail.value as Battery;
    this._fireChanged(batteries);
  }

  private _fireChanged(batteries: Battery[]): void {
    const config: PowerFlowCardPlusConfig = {
      ...this.config,
      entities: {
        ...this.config.entities,
        battery: batteries,
      },
    };
    fireEvent(this, "config-changed", { config });
  }

  private _computeLabelCallback = (schema: any) =>
    this.hass!.localize(`ui.panel.lovelace.editor.card.generic.${schema?.name}`) ||
    localize(`editor.${schema?.name}`) ||
    schema?.label;

  static get styles(): CSSResultGroup {
    return css`
      .edit-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-weight: 500;
      }
      .battery-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .battery-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        border-radius: 4px;
        background: var(--secondary-background-color);
      }
      .battery-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }
      .battery-name {
        flex: 1;
        font-size: 14px;
      }
      .add-row {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 8px;
        cursor: pointer;
        color: var(--primary-color);
      }
      .add-row span {
        font-size: 14px;
      }
      .empty-hint {
        color: var(--secondary-text-color);
        font-size: 13px;
        margin: 0 0 8px;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "batteries-editor": BatteriesEditor;
  }
}
