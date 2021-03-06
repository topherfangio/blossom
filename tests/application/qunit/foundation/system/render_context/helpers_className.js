// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/*global module test equals context ok same */

var context = null;

// ..........................................................
// classNames()
// 
suite("SC.RenderContext#classNames", {
  setup: function() {
    context = SC.RenderContext() ;
  }
});

test("returns empty array if no current class names", function() {
  same(context.classNames(), [], 'classNames') ;
});

test("classNames(array) updates class names", function() {
  var cl = 'bar baz'.w();
  equals(context.classNames(cl), context, "returns receiver");
  same(context.classNames(), cl, 'class names');
});

test("returns classNames if set", function() {
  context.classNames('bar'.w());
  same(context.classNames(), ['bar'], 'classNames');
});

test("clone on next retrieval if classNames(foo) set with cloneOnModify=YES", function() {
  var cl = 'foo bar'.w();
  context.classNames(cl, true);
  
  var result = context.classNames();
  ok(result !== cl, "class name is NOT same instance");
  same(result, cl, "but arrays are equivalent");
  
  equals(result, context.classNames(), "2nd retrieval is same instance");
});

test("extracts class names from element on first retrieval", function() {
  var elem = document.createElement('div');
  SC.$(elem).attr('class', 'foo bar');
  context = SC.RenderContext(elem);
  
  var result = context.classNames();
  same(result, ['foo', 'bar'], 'extracted class names');
  
  equals(context.classNames(), result, "should reuse same instance thereafter");
});

// ..........................................................
// hasClass()
// 
suite("SC.RenderContext#hasClass", {
  setup: function() {
    context = SC.RenderContext().classNames('foo bar'.w()) ;
  }
});

test("should return true if context classNames has class name", function() {
  equals(true, context.hasClass('foo'), 'should have foo');
});

test("should return false if context classNames does not have class name", function() {
  equals(false, context.hasClass('imaginary'), "should not have imaginary");
});

test("should return false if context has no classNames", function() {
  context = context.begin('div');
  ok(context.classNames().length===0, 'precondition - context has no classNames');
  equals(false, context.hasClass('foo'), 'should not have foo');
});

// ..........................................................
// addClass()
//
suite("SC.RenderContext#addClass", {
  setup: function() {
    context = SC.RenderContext().classNames(['foo']) ;
  }
});

test("shoudl return receiver", function() {
  equals(context.addClass('foo'), context, "receiver");
});

test("should add class name to existing classNames array on currentTag", function() {
  context.addClass('bar');
  same(context.classNames(), ['foo', 'bar'], 'has classes');
  equals(context._classNamesDidChange, true, "note did change");
});

test("should only add class name once - does nothing if name already in array", function() {
  same(context.classNames(), ['foo'], 'precondition - has foo classname');
  context._classNamesDidChange = false; // reset  to pretend once not modified
  
  context.addClass('foo');
  same(context.classNames(), ['foo'], 'no change');
  equals(context._classNamesDidChange, false, "note did not change");
});

// ..........................................................
// removeClass()
// 
suite("SC.RenderContext#removeClass", {
  setup: function() {
    context = SC.RenderContext().classNames(['foo', 'bar']) ;
  }
});

test("should remove class if already in classNames array", function() {
  ok(context.classNames().indexOf('foo')>=0, "precondition - has foo");
  
  context.removeClass('foo');
  ok(context.classNames().indexOf('foo')<0, "does not have foo");
});

test('should return receiver', function() {
  equals(context.removeClass('foo'), context, 'receiver');
});

test("should do nothing if class name not in array", function() {
  context._classNamesDidChange = false; // reset to pretend not modified
  context.removeClass('imaginary');
  same(context.classNames(), 'foo bar'.w(), 'did not change');
  equals(context._classNamesDidChange, false, "note did not change");
});

test("should do nothing if there are no class names", function() {
  context = context.begin();
  same(context.classNames(), [], 'precondition - no class names');
  context._classNamesDidChange = false; // reset to pretend not modified
  
  context.removeClass('foo');
  same(context.classNames(), [], 'still no class names -- and no errors');
  equals(context._classNamesDidChange, false, "note did not change");
});

// ..........................................................
// setClass
// 
suite("SC.RenderContext#setClass", {
  setup: function() {
    context = SC.RenderContext().addClass('foo') ;
  }
});

test("should add named class if shouldAdd is true", function() {
  ok(!context.hasClass("bar"), "precondition - does not have class bar");
  context.setClass("bar", true);
  ok(context.hasClass("bar"), "now has bar");
});

test("should remove named class if shouldAdd is false", function() {
  ok(context.hasClass("foo"), "precondition - has class foo");
  context.setClass("foo", false);
  ok(!context.hasClass("foo"), "should not have foo ");
});

test("should return receiver", function() {
  equals(context, context.setClass("bar", true), "returns receiver");
});

test("should add/remove all classes if a hash of class names is passed", function() {
  ok(context.hasClass("foo"), "precondition - has class foo");
  ok(!context.hasClass("bar"), "precondition - does not have class bar");

  context.setClass({ foo: false, bar: true });

  ok(context.hasClass("bar"), "now has bar");
  ok(!context.hasClass("foo"), "should not have foo ");
});
