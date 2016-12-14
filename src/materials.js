import * as three from 'three';

export default function createMaterial(properties, defaultType='MeshPhongMaterial') {
  let materialType = properties.type || defaultType,
    materialProperties = Object.assign({}, properties),
    material;

  if (!three[materialType] || !three[materialType].prototype.isMaterial) {
    throw new Error(`Invalid material type "${materialType}"`);
  }

  BLACKLIST.forEach(blacklisted => {
    delete materialProperties[blacklisted];
  });

  Object.keys(materialProperties).forEach(key => {
    let property = PROPERTIES[key],
      value = materialProperties[key],
      constructor = property && property.cast || property.default.constructor;

    if (property.enum && property.enum.indexOf(value) === -1) {
      value = property.default;
    }

    materialProperties[key] = constructor(value);
  });

  material = new three[materialType]();
  material.setValues(materialProperties);

  return material;
}

export const BLACKLIST = [
	'id',
	'uuid',
	'name',
	'type'
];

const CAST_FLOAT_0_1 = v => Math.max(0, Math.min(1, Number(v)));
const CAST_CONSTANT_NAME = v => three[v];
const CAST_COLOR = function(v) {
  let hex = v.match(/^(#|0x)[0-9a-z]$/i);
  if (hex) v = Number(hex[1]);
  return new three.Color(v);
}

export const PROPERTIES = {
	/**
	 *
	 * Material properties
	 *
	 * Omitted:
	 *	blendSrcAlpha
	 *	blendDstAlpha
	 *	blendEquationAlpha
	 *	clippingPlanes
	 *	clipIntersection
	 *	clipShadows
	 *	colorWrite
	 *	precision
	 *	polygonOffset
	 *	polygonOffsetFactor
	 *	polygonOffsetUnits
	 *
	 */
	fog: {
		default: true,
		cast: Boolean
	},
	lights: {
		default: true,
		cast: Boolean
	},
	blending: {
		default: 'NormalBlending',
		cast: CAST_CONSTANT_NAME,
    enum: [
			'NoBlending',
			'NormalBlending',
			'AdditiveBlending',
			'SubtractiveBlending',
			'MultiplyBlending',
			'CustomBlending'
		]
	},
	side: {
		default: 'FrontSide',
		cast: CAST_CONSTANT_NAME,
    enum: [
			'FrontSide',
			'BackSide',
			'DoubleSide'
		]
	},
	shading: {
		default: 'SmoothShading',
		cast: CAST_CONSTANT_NAME,
    enum: [
			'FlatShading',
			'SmoothShading'
		]
	},
	vertexColors: {
		default: 'NoColors',
		cast: CAST_CONSTANT_NAME,
    enum: [
			'NoColors',
			'VertexColors',
			'FaceColors'
		]
	},
	opacity: {
		default: 1.0,
		cast: CAST_FLOAT_0_1
	},
	transparent: {
		default: false,
		cast: Boolean
	},
	blendSrc: {
		default: 'SrcAlphaFactor',
		cast: CAST_CONSTANT_NAME,
    enum: [
			'ZeroFactor',
			'OneFactor',
			'SrcColorFactor',
			'OneMinusSrcColorFactor',
			'SrcAlphaFactor',
			'OneMinusSrcAlphaFactor',
			'DstAlphaFactor',
			'OneMinusDstAlphaFactor'
		]
	},
	blendDst: {
		default: 'OneMinusSrcAlphaFactor',
		cast: CAST_CONSTANT_NAME,
    enum: [
			'ZeroFactor',
			'OneFactor',
			'SrcColorFactor',
			'OneMinusSrcColorFactor',
			'SrcAlphaFactor',
			'OneMinusSrcAlphaFactor',
			'DstAlphaFactor',
			'OneMinusDstAlphaFactor'
		]
	},
	blendEquation: {
		default: 'AddEquation',
		cast: CAST_CONSTANT_NAME,
    enum: [
			'AddEquation',
			'SubtractEquation',
			'ReverseSubtractEquation',
			'MinEquation',
			'MaxEquation'
		]
	},
	depthFunc: {
		default: 'LessEqualDepth',
		cast: CAST_CONSTANT_NAME,
    enum: [
			'NeverDepth',
			'AlwaysDepth',
			'LessDepth',
			'LessEqualDepth',
			'GreaterEqualDepth',
			'GreaterDepth',
			'NotEqualDepth'
		]
	},
	depthTest: {
		default: true,
		cast: Boolean
	},
	depthWrite: {
		default: true,
		cast: Boolean
	},
	alphaTest: {
		default: 0,
		cast: CAST_FLOAT_0_1
	},
	premultipliedAlpha: {
		default: false,
		cast: Boolean
	},
	overdraw: {
		default: 0,
		cast: CAST_FLOAT_0_1
	},
	visible: {
		default: true,
		cast: Boolean
	},

	/**
	 *
	 * MeshBasicMaterial properties
	 *
	 * Omitted:
	 *	map
	 *	aoMap
	 *	aoMapIntensity
	 *	specularMap
	 *	alphaMap
	 *	envMap
	 *	combine
	 *
	 */
	color: {
		default: new three.Color( 0xffffff ),
		cast: CAST_COLOR
	},
  reflectivity: {
		default: 1,
		cast: CAST_FLOAT_0_1
	},
  refractionRatio: {
		default: 0.98,
		cast: CAST_FLOAT_0_1
	},
  wireframe: {
		default: false,
		cast: Boolean
	},
  wireframeLinewidth: {
		default: 1,
		cast: CAST_FLOAT_0_1
	},
  wireframeLinecap: {
		default: 'round',
		cast: CAST_CONSTANT_NAME,
    enum: [
			'butt',
			'round',
			'square'
		]
	},
  wireframeLinejoin: {
		default: 'round',
		cast: CAST_CONSTANT_NAME,
    enum: [
			'round',
			'bevel',
			'miter'
		]
	},
  skinning: {
		default: false,
		cast: Boolean
	},
  morphTargets: {
		default: false,
		cast: Boolean
	},


	/**
	 *
	 * LineBasicMaterial/LineDashedMaterial properties
	 *
	 */
	scale: {
		default: 1
	},
	linewidth: {
		default: 1
	},
	linecap: {
		default: 'round',
		cast: CAST_CONSTANT_NAME,
    enum: [
			'butt',
			'round',
			'square'
		]
	},
  linejoin: {
		default: 'round',
		cast: CAST_CONSTANT_NAME,
    enum: [
			'round',
			'bevel',
			'miter'
		]
	},
  dashSize: {
		default: 3
	},
  gapSize: {
		default: 1
	},


  /**
   *
   * MeshPhongMaterial properties
   *
   * Omitted:
   *  map
   *  lightMap
   *  lightMapIntensity
   *  aoMap
   *  aoMapIntensity
   *  emissiveMap
   *  bumpMap
   *  bumpScale
   *  normalMap
   *  normalScale
   *  displacementMap
   *  displacementScale
   *  displacementBias
   *  specularMap
   *  alphaMap
   *  envMap
   *  combine
   *
   */
  specular: {
    default: new three.Color( 0x111111 ),
    cast: CAST_COLOR
  },
  shininess: {
    default: 30,
    cast: Number
  },
  emissive: {
    default: new three.Color( 0x000000 ),
    cast: CAST_COLOR
  },
  emissiveIntensity: {
    default: 1.0,
    cast: Number
  },
  morphNormals: {
    default: false,
    cast: Boolean
  }
}
