import { DirectionalLight } from "three";

function createLights() {
  const light = new DirectionalLight("white", 4);

  light.castShadow = true;

  light.position.set(0, 10, 0);

  return light;
}

function applyShadow(shadowTarget){
  shadowTarget.castShadow = true;
  shadowTarget.recieveShadow = true;

  return shadowTarget;
}

export { createLights, applyShadow };
