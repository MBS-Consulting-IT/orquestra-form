var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// node_modules/orquestra-utils/dist/orquestra-utils.js
var require_orquestra_utils = __commonJS({
  "node_modules/orquestra-utils/dist/orquestra-utils.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.Utils = {}));
    })(exports, function(exports2) {
      "use strict";
      const defaults = {
        container: "tr",
        hideClass: "hidden",
        requiredClass: "execute-required",
        dataAttrRequired: "data-was-required"
      };
      const fieldsTypesValueBased = [
        "text",
        "textarea",
        "select-one",
        "hidden"
      ];
      function getFieldById(fieldId, { returnArray }) {
        returnArray = returnArray || false;
        fieldId = fieldId.substring(0, 3) === "inp" ? fieldId : `inp${fieldId}`;
        const fields = document.querySelectorAll(`[xname="${fieldId}"]`);
        if (!fields) {
          console.error(`[Util] Nehum campo de formul\xE1rio encontrado para o identificador ${fieldId.substring(3)}`);
          return null;
        }
        if (returnArray) {
          return [...fields];
        }
        return fields.length > 1 ? [...fields] : fields[0];
      }
      function isFieldRequired(fields) {
        return fields.some((field) => field.getAttribute(defaults.dataAttrRequired) || field.getAttribute("required") === "S");
      }
      function clearFileField(field) {
        const fieldId = field.getAttribute("xname").substring(3);
        const deleteBtn = field.parentElement.querySelector(`[xid=div${fieldId}] > a:last-of-type`);
        if (deleteBtn) {
          deleteBtn.click();
        }
      }
      function handleField(field, containerRef) {
        const fields = getField2(field, { returnArray: true });
        if (!fields) {
          return;
        }
        const container = getContainer(fields[0], containerRef);
        if (!container) {
          return;
        }
        const isRequired = isFieldRequired(fields);
        return {
          fields,
          container,
          isRequired
        };
      }
      function getContainer(field, containerRef) {
        const container = field.closest(containerRef);
        const fieldId = field.getAttribute("xname").substring(3);
        if (!container) {
          console.error(`[Util] n\xE3o encontrado HTMLElement para refer\xEAncia ${container} a partir do campo ${fieldId}`);
        }
        return container;
      }
      function getField2(field, options = {}) {
        const returnArray = options.returnArray || false;
        if (field instanceof jQuery) {
          return returnArray || field.length > 0 ? [...field] : field[0];
        }
        if (field instanceof HTMLElement) {
          return returnArray ? [field] : field;
        }
        if (field instanceof HTMLCollection || field instanceof NodeList || Array.isArray(field)) {
          return [...field];
        }
        if (typeof field === "string") {
          return getFieldById(field, { returnArray });
        }
      }
      function clearField(fields) {
        const changeEvent = new Event("change");
        fields = Array.isArray(fields) ? fields : getField2(fields, { returnArray: true });
        fields.forEach((field) => {
          const fieldType = field.type;
          const xType = field.getAttribute("xtype");
          if (fieldsTypesValueBased.includes(fieldType)) {
            if (xType === "FILE") {
              clearFileField(field);
            } else {
              field.value = "";
            }
          } else {
            field.checked = false;
          }
          field.dispatchEvent(changeEvent);
        });
      }
      function onFileChange(fields, callback) {
        const [field] = getField2(fields, { returnArray: true });
        const xType = field.getAttribute("xtype");
        const id = field.getAttribute("xname").substring(3);
        const btn = field.nextElementSibling;
        if (xType !== "FILE") {
          return console.error(`[Util] Para observar mudan\xE7as o campo deve ser do tipo Arquivo. Tipo informado: ${xType}`);
        }
        const observer = new MutationObserver(handleFileChange);
        observer.observe(btn, { attributes: true });
        function handleFileChange(mutationsList, observer2) {
          mutationsList.forEach((mutation) => {
            if (mutation.type === "attributes") {
              const deleteBtn = field.parentElement.querySelector(`[xid=div${id}] > a:last-of-type`);
              const filepath = field.value;
              if (deleteBtn) {
                deleteBtn.addEventListener("click", () => callback(null));
              }
              callback(filepath, deleteBtn);
            }
          });
        }
      }
      function addRequired(fields, params) {
        params = {
          toggleClass: false,
          ...defaults,
          ...params
        };
        fields = Array.isArray(fields) ? fields : getField2(fields, { returnArray: true });
        const container = getContainer(fields[0], params.container);
        fields.forEach((field) => {
          field.setAttribute("required", "S");
          field.removeAttribute(params.dataAttrRequired);
        });
        if (params.toggleClass) {
          container.classList.add(params.requiredClass);
        }
      }
      function removeRequired(fields, params) {
        params = {
          toggleClass: false,
          ...defaults,
          ...params
        };
        fields = Array.isArray(fields) ? fields : getField2(fields, { returnArray: true });
        const container = getContainer(fields[0], params.container);
        fields.forEach((field) => {
          field.setAttribute("required", "N");
          field.setAttribute(params.dataAttrRequired, true);
        });
        if (params.toggleClass) {
          container.classList.remove(params.requiredClass);
        }
      }
      function showField2(field, params) {
        params = {
          ...defaults,
          ...params
        };
        const props = handleField(field, params.container);
        if (!props) {
          return;
        }
        const { fields, container, isRequired } = props;
        container.classList.remove(params.hideClass);
        if (isRequired) {
          addRequired(fields, params);
        }
      }
      function hideField2(field, params) {
        params = {
          ...defaults,
          ...params
        };
        const props = handleField(field, params.container);
        if (!props) {
          return;
        }
        const { fields, container, isRequired } = props;
        container.classList.add(params.hideClass);
        clearField(fields);
        if (isRequired) {
          removeRequired(fields, params);
        }
      }
      function setup(config) {
        const getField3 = (field) => getField3();
        const clearField2 = (field) => clearField2();
        const addRequired2 = (field) => addRequired2();
        const removeRequired2 = (field) => removeRequired2();
        const showField3 = (field) => showField3();
        const hideField3 = (field) => hideField3();
        return {
          getField: getField3,
          clearField: clearField2,
          addRequired: addRequired2,
          removeRequired: removeRequired2,
          showField: showField3,
          hideField: hideField3,
          onFileChange
        };
      }
      exports2.addRequired = addRequired;
      exports2.clearField = clearField;
      exports2.getField = getField2;
      exports2.hideField = hideField2;
      exports2.onFileChange = onFileChange;
      exports2.removeRequired = removeRequired;
      exports2.setup = setup;
      exports2.showField = showField2;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// src/core/config.js
var DEFAULT_FIELD_CONFIG = {
  triggers: ["change"],
  runOnload: true,
  container: "tr",
  hiddenClass: "hidden"
};

// src/core/useField.js
var import_orquestra_utils = __toModule(require_orquestra_utils());
function useField(config) {
  const params = {
    ...DEFAULT_FIELD_CONFIG,
    ...config
  };
  const state = {
    values: []
  };
  const instance = {
    field: [],
    triggers: [],
    effect,
    value
  };
  init();
  return instance;
  function init() {
    const taskAlias = document.querySelector("#inpDsFlowElementAlias");
    instance.field = (0, import_orquestra_utils.getField)(params.field, { returnArray: true });
    instance.triggers = params.triggers;
    if (params.alias && taskAlias) {
      if (!params.alias.includes(taskAlias.value))
        return;
    }
    addTriggers(instance.field);
    if (params.runOnload) {
      handleEffect();
    }
  }
  function addTriggers(field) {
    instance.triggers.forEach((trigger) => field.forEach((input) => input.addEventListener(trigger, handleEffect)));
  }
  function getFieldValue() {
    const type = instance.field[0].type;
    if (type === "checkbox") {
      return instance.field.filter((field) => field.checked).map((field) => field.value);
    }
    if (type === "radio") {
      return instance.field.find((field) => field.checked)?.value;
    }
    return instance.field[0].value;
  }
  function handleEffect(event) {
    const values = getFieldValue(instance.field);
    state.values = values;
    if (params.callback)
      params.callback(values, event);
    if (!params.when)
      return;
    const { match, notMatch } = Object.entries(params.when).reduce((fields, [condition, options]) => {
      values.includes(condition) ? fields.match.push(params.when[condition]) : fields.notMatch.push(params.when[condition]);
      return fields;
    }, { match: [], notMatch: [] });
    match.forEach((options) => handleMatchCondition(options, values, event));
    notMatch.forEach((options) => handleNotMatchCondition(options));
  }
  function handleNotMatchCondition(options) {
    const utilsConfig = { container: options.container || params.container };
    if (options.show) {
      options.show.forEach((fieldId) => (0, import_orquestra_utils.hideField)(fieldId, utilsConfig));
    }
    if (options.showGroup) {
      hideGroupField(options.showGroup, utilsConfig);
    }
  }
  function handleMatchCondition(options, values, event) {
    const utilsConfig = { container: options.container || params.container };
    if (options.callback)
      options.callback(values, event);
    if (options.show) {
      options.show.forEach((fieldId) => (0, import_orquestra_utils.showField)(fieldId, utilsConfig));
    }
    if (options.showGroup) {
      showGroupField(options.showGroup, utilsConfig);
    }
  }
  function showGroupField(selectors, config2) {
    selectors.forEach((selector) => {
      const container = document.querySelector(selector);
      if (!container)
        return;
      container.classList.remove(params.hiddenClass);
      container.querySelectorAll("[xname]").forEach((field) => (0, import_orquestra_utils.showField)(field, config2));
    });
  }
  function hideGroupField(selectors, config2) {
    selectors.forEach((selector) => {
      const container = document.querySelector(selector);
      if (!container)
        return;
      container.classList.add(params.hiddenClass);
      container.querySelectorAll("[xname]").forEach((field) => (0, import_orquestra_utils.hideField)(field, config2));
    });
  }
  function effect() {
    handleEffect();
  }
  function value() {
    return state.values;
  }
}

// src/main.js
var useFields = (fieldsConfig) => fieldsConfig.forEach(useField);
export {
  useField,
  useFields
};
