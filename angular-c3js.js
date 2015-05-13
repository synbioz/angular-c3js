'use strict';

angular.module('synbioz.angular-c3js', [])
.directive('szC3Chart', ['$timeout', function($timeout) {
  return {
    replace: true,
    transclude: true,
    scope: {
      // chart
      bindto: '@',
      size: '=',
      padding: '=',
      colorPattern: '=',

      // data
      x: '@',
      order: '@',
      labels: '=',
      type: '@',
      axes: '=',
      colors: '=',
      groups: '=',
      json: '=',
      rows: '=',
      columns: '=',
      curvesOptions: '=',
      color: '&'
    },
    template: '<div id="{{ bindto }}" ng-transclude></div>',

    controller: ['$scope', '$timeout', function($scope, $timeout) {

      $scope.config = {
        bindto: "#" + $scope.bindto,
        axis: {},
        data: {
          columns: [] // avoid error for no "url or json or rows or columns" on load
        }
      };

      this.addAxis = function(axis) {
        $scope.config.axis = axis;
      };

      this.addGrid = function(grid) {
        $scope.config.grid = grid;
      };

      this.addLegend = function(legend) {
        $scope.config.legend = legend;
      };

      this.addTooltip = function(tooltip) {
        $scope.config.tooltip = tooltip;
      };

      this.addRegions = function(regions) {
        $scope.config.regions = regions;
      };

      this.addSubchart = function(subchart) {
        $scope.config.subchart = subchart;
      };

      this.addZoom = function(zoom) {
        $scope.config.zoom = zoom;
      };

      this.addPoint = function(point) {
        $scope.config.point = point;
      };

      this.addLine = function(line) {
        $scope.config.line = line;
      };

      this.addBar = function(bar) {
        $scope.config.bar = bar;
      };

      this.addDonut = function(donut) {
        $scope.config.donut = donut;
      };

      this.generate = function() {
        if($scope.size) {
          $scope.config.size = $scope.size;
        }

        if($scope.padding) {
          $scope.config.padding = $scope.padding;
        }

        if($scope.colorPattern) {
          $scope.config.color = { pattern: $scope.colorPattern };
        }

        if($scope.x) {
          $scope.config.data.x = $scope.x;
        }

        if($scope.axes) {
          $scope.config.data.axes = $scope.axes;
        }

        if($scope.color) {
          $scope.config.data.color = $scope.color();
        }

        if($scope.colors) {
          $scope.config.data.colors = $scope.colors;
        }

        if($scope.groups) {
          $scope.config.data.groups = $scope.groups;
          $scope.config.data.order = $scope.order || 'desc';
        }

        if($scope.labels) {
          $scope.config.data.labels = $scope.labels;
        }

        if($scope.type) {
          $scope.config.data.type = $scope.type;
        }

        if($scope.json) {
          $scope.config.data.json = $scope.json;
        }

        if($scope.rows) {
          $scope.config.data.rows = $scope.rows;
        }

        if($scope.columns) {
          $scope.config.data.columns = $scope.columns;
        }

        if($scope.curvesOptions) {
          var keys = { value: [] };

          for(var i = 0; i < $scope.curvesOptions.length; i++) {
            var curve = $scope.curvesOptions[i];

            if(curve.id === 'x') {
              keys.x = curve.value;
            }
            else {
              keys.value.push(curve.id);
              defineCurveOptions(curve.id, curve.type, curve.name, curve.color);
            }
          }

          $scope.config.data.keys = keys;
        }

        $scope.chart = c3.generate($scope.config);
      };

      // Generate data's types, names and colors options for the curve
      function defineCurveOptions(id, type, name, color) {
        if(type !== undefined) {
          $scope.config.data.types = $scope.config.data.types || {};
          $scope.config.data.types[id] = type;
        }
        if(name !== undefined) {
          $scope.config.data.names = $scope.config.data.names || {};
          $scope.config.data.names[id] = name;
        }
        if(color !== undefined) {
          $scope.config.data.colors = $scope.config.data.colors || {};
          $scope.config.data.colors[id] = color;
        }
      };

      // Live update chart's data
      $scope.$on('ReloadData', function(event, newData) {
        $timeout(function() {
          if(newData.hasOwnProperty('columns')) {
            $scope.chart.load({
              columns: newData.columns
            });
          }
          else if(newData.hasOwnProperty('rows')) {
            $scope.chart.load({
              columns: newData.rows
            });
          }
          else if(newData.hasOwnProperty('json')) {
            $scope.chart.load({
              json: newData.json,
              keys: { value: newData.keys }
            });
          }
        });
      });

      // Live update chart's range
      $scope.$on('ChangeRange', function(event, newRange) {
        $timeout(function() {
          $scope.chart.axis.range({
            min: newRange.min,
            max: newRange.max
          });
        });
      });

    }],

    link: function(scope, element, attrs, controller) {
      $timeout(function() {
        controller.generate();
      });
    }
  };
}])
.directive('axis', function() {
  return {
    require: '^szC3Chart',
    scope: {
      rotated: '@'
    },

    controller: ['$scope', function($scope) {
      $scope.axis = {};

      this.addAxisConfig = function(id, axis) {
        $scope.axis[id] = axis;
      };
    }],

    link: function(scope, element, attrs, controller) {
      if(attrs.rotated !== undefined) {
        scope.axis.rotated = true;
      }

      controller.addAxis(scope.axis);
    }
  };
})
.directive('axisX', function() {
  return {
    require: '^axis',
    scope: {
      show: '@',
      label: '@',
      position: '@',
      type: '@',
      height: '@',
      categories: '=',
      min: '=',
      max: '='
    },

    controller: ['$scope', function($scope) {
      $scope.x = {};

      this.addTick = function(tick) {
        $scope.x.tick = tick;
      };
    }],

    link: function(scope, element, attrs, controller) {
      scope.x.label = {
        text: attrs.label,
        position: attrs.position
      };

      if(attrs.show === 'false') {
        scope.x.show = false;
      }

      if(attrs.type) {
        scope.x.type = attrs.type;
      }

      if(attrs.height) {
        scope.x.height = attrs.height;
      }

      if(scope.categories) {
        scope.x.type = 'category';
        scope.x.categories = scope.categories;
      }

      if(scope.min) {
        scope.x.min = scope.min;
      }
      if(scope.max) {
        scope.x.max = scope.max;
      }

      controller.addAxisConfig('x', scope.x);
    }
  };
})
.directive('axisY', function() {
  return {
    require: '^axis',
    scope: {
      id: '@',
      show: '@',
      label: '@',
      position: '@',
      paddingTop: '@',
      paddingBottom: '@',
      min: '=',
      max: '='
    },
    link: function(scope, element, attrs, controller) {
      var y = {
        label: {
          text: attrs.label,
          position: attrs.position
        }
      };

      if(attrs.id === 'y2') {
        y.show = true;
      }

      if(attrs.show === 'false') {
        y.show = false;
      }

      if(attrs.paddingTop) {
        y.padding = y.padding || {};
        y.padding.top = attrs.paddingTop;
      }

      if(attrs.paddingBottom) {
        y.padding = y.padding || {};
        y.padding.bottom = attrs.paddingBottom;
      }

      if(scope.min) {
        y.min = scope.min;
      }
      if(scope.max) {
        y.max = scope.max;
      }

      controller.addAxisConfig(attrs.id, y);
    }
  };
})
.directive('axisXTick', function() {
  return {
    require: '^axisX',
    scope: {
      count: '@',
      format: '@',
      rotate: '@',
      fit: '@',
      culling: '='
    },
    link: function(scope, element, attrs, controller) {
      var tick = {};

      if(attrs.count) {
        tick.count = attrs.count;
      }

      if(attrs.format) {
        tick.format = attrs.format;
      }

      if(scope.culling !== undefined) {
        tick.culling = scope.culling;
      }

      if(attrs.rotate) {
        tick.rotate = attrs.rotate;
      }

      if(attrs.fit === 'false') {
        tick.fit = false;
      }

      controller.addTick(tick);
    }
  };
})
.directive('grid', function() {
  return {
    require: '^szC3Chart',
    scope: {
      showX: '@',
      showY: '@',
      linesX: '=',
      linesY: '=',
      linesY2: '='
    },
    link: function(scope, element, attrs, controller) {
      var grid = {};

      if(attrs.showX !== undefined || scope.linesX) {
        grid.x = {};

        if(attrs.showX === 'true') {
          grid.x.show = true
        }

        if(scope.linesX) {
          grid.x.lines = scope.linesX;
        }
      }

      if(attrs.showY !== undefined || scope.linesY) {
        grid.y = {};

        if(attrs.showY === 'true') {
          grid.y.show = true
        }

        if(scope.linesY) {
          grid.y.lines = scope.linesY;
        }

        if(scope.linesY2) {
          grid.y.lines = grid.y.lines || [];

          for(var i = 0; i < scope.linesY2.length; i++) {
            scope.linesY2[i].axis = 'y2';
          }

          grid.y.lines.concat(scope.linesY2);
        }
      }

      controller.addGrid(grid);
    }
  };
})
.directive('legend', function() {
  return {
    require: '^szC3Chart',
    scope: {
      show: '@',
      position: '@',
      hide: '='
    },
    link: function(scope, element, attrs, controller) {
      var legend = {};

      if(attrs.show === 'false') {
        legend.show = false;
      }

      if(scope.hide) {
        legend.hide = scope.hide;
      }

      if(attrs.position) {
        legend.position = attrs.position;
      }

      controller.addLegend(legend);
    }
  };
})
.directive('tooltip', function() {
  return {
    require: '^szC3Chart',
    scope: {
      show: '@',
      grouped: '@',
      format: '='
    },
    link: function(scope, element, attrs, controller) {
      var tooltip = {};

      if(attrs.show === 'false') {
        tooltip.show = false;
      }

      if(attrs.grouped === 'false') {
        tooltip.grouped = false;
      }

      if(scope.format) {
        tooltip.format = scope.format;
      }

      controller.addTooltip(tooltip);
    }
  };
})
.directive('region', function() {
  return {
    require: '^szC3Chart',
    scope: {
      regions: '='
    },
    link: function(scope, element, attrs, controller) {
      controller.addRegions(scope.regions);
    }
  };
})
.directive('subchart', function() {
  return {
    require: '^szC3Chart',
    scope: {
      height: '@'
    },
    link: function(scope, element, attrs, controller) {
      var subchart = { show: true };

      if(attrs.height) {
        subchart.size = { height: attrs.height };
      }

      controller.addSubchart(subchart);
    }
  };
})
.directive('zoom', function() {
  return {
    require: '^szC3Chart',
    scope: {
      rescale: '@'
    },
    link: function(scope, element, attrs, controller) {
      var zoom = { enabled: true };

      if(attrs.rescale !== undefined) {
        zoom.rescale = true;
      }

      controller.addZoom(zoom);
    }
  };
})
.directive('point', function() {
  return {
    require: '^szC3Chart',
    scope: {
      show: '@',
      r: '@'
    },
    link: function(scope, element, attrs, controller) {
      var point = {};

      if(attrs.show === 'false') {
        point.show = false;
      }

      if(attrs.r) {
        point.r = attrs.r;
      }

      controller.addPoint(point);
    }
  };
})
.directive('line', function() {
  return {
    require: '^szC3Chart',
    scope: {
      connectNull: '@',
      stepType: '@'
    },
    link: function(scope, element, attrs, controller) {
      var line = {};

      if(attrs.connectNull === 'true') {
        line.connectNull = true;
      }

      if(attrs.stepType) {
        line.step = { type: attrs.stepType };
      }

      controller.addLine(line);
    }
  };
})
.directive('bar', function() {
  return {
    require: '^szC3Chart',
    scope: {
      zerobased: '@',
      width: '='
    },
    link: function(scope, element, attrs, controller) {
      var bar = {};

      if(scope.width) {
        bar.width = scope.width;
      }

      if(attrs.zerobased === 'false') {
        bar.zerobased = false;
      }

      controller.addBar(bar);
    }
  };
})
.directive('donut', function() {
  return {
    require: '^szC3Chart',
    scope: {
      title: '@',
      width: '@',
      label: '='
    },
    link: function(scope, element, attrs, controller) {
      var donut = {};

      if(attrs.title) {
        donut.title = attrs.title;
      }

      if(attrs.width) {
        donut.width = attrs.width;
      }

      if(scope.label) {
        donut.label = scope.label;
      }

      controller.addDonut(donut);
    }
  };
});
