// apps/docs/app/components/CardPreview.tsx
import solarIcon from "@/icons/solar.svg";
import "@flixlix-cards/shared/style";
import { useEffect, useRef, useState } from "react";

type PreviewCardElement = HTMLElement & {
  hass: {
    states: Record<string, { state: string; attributes: Record<string, unknown> }>;
    language: string;
    localize: (key: string) => string;
  };
  setConfig: (config: Record<string, unknown>) => void;
};

const LOCALIZE_MAP: Record<string, string> = {
  "ui.panel.lovelace.cards.energy.energy_distribution.grid": "Grid",
  "ui.panel.lovelace.cards.energy.energy_distribution.solar": "Solar",
  "ui.panel.lovelace.cards.energy.energy_distribution.battery": "Battery",
  "ui.panel.lovelace.cards.energy.energy_distribution.home": "Home",
  "card.label.non_fossil_fuel_percentage": "Non-fossil",
};

function localizePreview(key: string) {
  return LOCALIZE_MAP[key] ?? key;
}

const ICON_MAP: Record<string, string | HTMLElement> = {
  "mdi:transmission-tower": "⚡",
  "mdi:solar-power": solarIcon,
  "mdi:home": "⌂",
  "mdi:battery-high": "🔋",
  "mdi:battery-medium": "🔋",
  "mdi:battery-low": "🔋",
  "mdi:battery-outline": "🔋",
  "mdi:leaf": "🍃",
  "mdi:arrow-left": "←",
  "mdi:arrow-right": "→",
  "mdi:arrow-up": "↑",
  "mdi:arrow-down": "↓",
};

class HaIconPreview extends HTMLElement {
  static get observedAttributes() {
    return ["icon"];
  }

  get icon() {
    return this.getAttribute("icon") ?? "";
  }

  set icon(value: string) {
    this.setAttribute("icon", value);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const iconName = this.icon;
    this.innerHTML = (ICON_MAP[iconName] as HTMLElement).outerHTML ?? "•";
    this.style.display = "inline-flex";
    this.style.alignItems = "center";
    this.style.justifyContent = "center";
    this.style.width = "1em";
    this.style.height = "1em";
    this.style.lineHeight = "1";
    this.style.fontSize = "var(--mdc-icon-size, 24px)";
  }
}

export function CardPreview() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!customElements.get("ha-icon")) {
      customElements.define("ha-icon", HaIconPreview);
    }
    import("power-flow-card-plus").then(() => {
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded && hostRef.current) {
      hostRef.current.style.setProperty("--primary-text-color", "#1f2937");
      hostRef.current.style.setProperty("--secondary-text-color", "#4b5563");
      hostRef.current.style.setProperty("--primary-color", "#03a9f4");
      hostRef.current.style.setProperty("--card-background-color", "#ffffff");
      hostRef.current.style.setProperty("--divider-color", "#d1d5db");
      hostRef.current.style.setProperty("--ha-card-border-color", "#d1d5db");
      hostRef.current.style.setProperty("--ha-card-border-radius", "12px");
      hostRef.current.style.setProperty("--energy-grid-consumption-color", "#488fc2");
      hostRef.current.style.setProperty("--energy-grid-return-color", "#8353d1");
      hostRef.current.style.setProperty("--energy-solar-color", "#ff9800");
      hostRef.current.style.setProperty("--energy-battery-in-color", "#f06292");
      hostRef.current.style.setProperty("--energy-battery-out-color", "#4db6ac");
      hostRef.current.style.setProperty("--energy-non-fossil-color", "#0f9d58");

      const card = document.createElement("power-flow-card-plus") as PreviewCardElement;

      card.hass = {
        states: {
          "sensor.grid_consumption": { state: "1.5", attributes: { unit_of_measurement: "kW" } },
          "sensor.solar_production": { state: "3.2", attributes: { unit_of_measurement: "kW" } },
        },
        language: "en",
        localize: localizePreview,
      };

      card.setConfig({
        entities: {
          grid: {
            entity: "sensor.grid_consumption",
          },
          solar: {
            entity: "sensor.solar_production",
          },
        },
      });

      hostRef.current.innerHTML = "";
      hostRef.current.appendChild(card);
    }
  }, [loaded]);

  return <div ref={hostRef} className="w-[300px]" />;
}
