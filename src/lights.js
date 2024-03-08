import { PointLight } from "three";

function createLights() {
  const light = new PointLight("white", 1000);

  light.castShadow = true;

  light.position.set(0, 25, 0);

  return light;
}

function applyShadow(shadowTarget) {
  shadowTarget.castShadow = true;
  shadowTarget.recieveShadow = true;

  return shadowTarget;
}

export { createLights, applyShadow };
