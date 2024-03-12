import * as THREE from "three";
import * as CANNON from "cannon-es";

class ObjectWithAutoBox {
  constructor(threeJSObject, mass) {
    this.object = threeJSObject;
    this.mass = mass;
    this.body = genBody(this.object, this.mass);
    this.mesh = this.object.children[0];
    this.debug = false;
  }
  genBody = function (threeJSObject, mass) {
    const objectBox = new THREE.Box3().setFromObject(threeJSObject);
    const objectBoxPhysicsShape = new CANNON.Box(
      new CANNON.Vec3(
        (objectBox.max.x - objectBox.min.x) / 2,
        (objectBox.max.y - objectBox.min.y) / 2,
        (objectBox.max.z - objectBox.min.z) / 2,
      ),
    );
    this.body = new CANNON.Body({ mass: mass });
    this.body.addShape(objectBoxPhysicsShape);
  };
}

export { ObjectWithAutoBox };
