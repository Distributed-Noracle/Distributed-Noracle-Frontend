/**
 * @fileoverview Externs for webcomponents polyfills
 * @externs
 */
/* eslint-disable */

let HTMLImports = {
  /**
   * @param {function()} callback
   */
  whenReady(callback){},
  /**
   * @param {Element} element
   * @returns {Document} document
   */
  importForElement(element){}
};

window.HTMLImports = HTMLImports;

let ShadyDOM = {
  inUse: false,
  flush(){},
  /**
   * @param {!GraphNode} target
   * @param {function(Array<MutationRecord>, MutationObserver)} callback
   * @return {MutationObserver}
   */
  observeChildren(target, callback){},
  /**
   * @param {MutationObserver} observer
   */
  unobserveChildren(observer){},
  /**
   * @param {GraphNode} node
   */
  patch(node){}
};

window.ShadyDOM = ShadyDOM;

let WebComponents = {};
window.WebComponents = WebComponents;

/** @type {Element} */
HTMLElement.prototype._activeElement;

/**
 * @param {HTMLTemplateElement} template
 */
HTMLTemplateElement.decorate = function(template){};

/**
 * @param {function(function())} cb callback
 */
CustomElementRegistry.prototype.polyfillWrapFlushCallback = function(cb){};
