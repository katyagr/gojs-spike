/*
 *  Copyright (C) 1998-2024 by Northwoods Software Corporation. All Rights Reserved.
 *
 *  Restricted Rights: Use, duplication, or disclosure by the U.S.
 *  Government is subject to restrictions as set forth in subparagraph
 *  (c) (1) (ii) of DFARS 252.227-7013, or in FAR 52.227-19, or in FAR
 *  52.227-14 Alt. III, as applicable.
 *
 *  This software is proprietary to and embodies the confidential
 *  technology of Northwoods Software Corporation. Possession, use, or
 *  copying of this software and media is authorized only pursuant to a
 *  valid written license from Northwoods or an authorized sublicensor.
 */

import * as gojs from 'gojs';
import { Test, TestCollection, TestRoot } from './gotest.js';

(function () {
  const nsTests = new TestCollection('namespace');
  TestRoot.add(nsTests);

  nsTests.add(new Test("check module namespace", null,
    function(test: Test) {
      const diag = test.diagram as any;
      const ns = gojs as any;  // what was imported
      const go2 = ns.go as any;  // the real "go"

      test.assert(typeof ns === "object", "oops, ns isn't an Object")
      test.assert(typeof go2 === "object", "oops, ns.go isn't an Object")

      // check on global "go"
      test.assert(window.go !== ns && window.go === go2, "window.go isn't go2")

      // check on version property
      test.assert(typeof ns.version === "string", "ns.version isn't a string")
      test.assert(ns.version === go2.version, "version isn't the same string")
      test.assert(typeof ns.Diagram === "function", "ns.Diagram isn't defined")
      test.assert(ns.Diagram === go2.Diagram, "Diagram isn't the same class")
      test.assert(ns.Diagram.version === ns.version, "Diagram.version isn't the same")
    
      // check on namespace reference on each Diagram
      test.assert(diag.go === go2, "myDiagram.go isn't go2")
    
      // compare names in ns vs go2, excluding any "go" property
      const nssyms = new gojs.Set();
      for (let p in ns) {
        if (p !== "go" && p !== "default") nssyms.add(p);
      }
      const go2syms = new gojs.Set();
      for (let p in go2) {
        if (p !== "go" && p !== "default") go2syms.add(p);
      }
      test.assert(nssyms.count === go2syms.count, "# names on ns !== # names on go2 " + nssyms.count + " " + go2syms.count)
    
      let nsonly = "";
      for (let p of (nssyms.copy().removeAll(go2syms))) nsonly += p + " ";
      test.assert(nsonly === "", "ns only: " + nsonly)
      let go2only = "";
      for (let p of (go2syms.copy().removeAll(nssyms))) go2only += p + " ";
      test.assert(go2only === "", "go2 only: " + go2only)
    }
  ));
})();
