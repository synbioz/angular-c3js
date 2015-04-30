# angular-c3js

Sets of AngularJS directives that wrap [C3js](http://c3js.org/)

# Dependencies

* AngularJS
* D3js
* C3js (js and css)

# Install

Download dependencies files and load it:

~~~html
<link rel="stylesheet" href="c3.css">
<script src="angular.js"></script>
<script src="d3.js"></script>
<script src="c3.js"></script>
<script src="angular-c3js.js"></script>
~~~

# How to use

Prepare your data and options according to the C3js API, then declare the directives in the templates:

~~~html
<sz-c3-chart bindto="chart-id"
             size="{ width: 600 }"
             type="pie"
             columns="columns"
             curves-options="curvesOptions">
  <legend position="right"></legend>
</sz-c3-chart>
~~~

The directives and their scope sections informs you about what parts of the C3js API are supported.

To dynamically update the chart data, send a `ReloadData` event with the new ones:

~~~javascript
$scope.$broadcast('ReloadData', {
  columns: newData
});
~~~

Can be use with `columns`, `rows`, and `json`, just use the proper data format of C3js.

To dynamically update the x axis, send a `ChangeRange` event with the new range:

~~~javascript
$scope.$broadcast('ChangeRange', {
  min: { x: newRange.min },
  max: { x: newRange.max }
});
~~~

Feel free to fork it !

