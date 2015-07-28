/*
 * dragSwitch
 * https://github.com/coolskull/dragSwitch
 *
 * Copyright (c) 2015 skull
 * Licensed under the MIT license.
 */

(function ($) {
    var dragSwitch = {
        init: function (opts, $obj) {
            var self = this;
            self._opts = opts;
            self._$obj = $obj;
            self.createItemList();
            self.createSlider();
            self.setWidth();
            self._size = opts.range / (opts.items.length - 1);

            $obj.on('touchend touchcancel mouseup', function () {
                setTimeout(function () {

                    self._RangeSlider.setValue((self._val) * self._size);
                    if (opts.dragSliderEnd) {
                        opts.dragSliderEnd(self);
                    }
                }, 50);
            });
        },
        createItemList: function () {
            var self = this,
                $obj = self._$obj,
                opts = self._opts,
                html = "";

            $obj.addClass('switch');
            html += '<ul>';
            $.each(opts.items, function (i, item) {
                html += '<li>';
                if (i !== 0) {
                    html += '<span class="rect rect_before"></span>';
                }
                html += '    <span class="center">';
                html += '       <span class="circle"><i class="icon icon_' + item.name + '"></i></span>';
                html += '       <span class="text">' + item.text + '</span>';
                html += '    </span>';
                if (i !== (opts.items.length - 1)) {
                    html += '<span class ="rect rect_after"></span>';
                }
                html += '</li>';


            });
            html += '</ul>';
            $obj.prepend(html);


        },
        createSlider: function () {

            var self = this,
                $obj = self._$obj,
                opts = self._opts;

            var max = opts.range || 10;

            var sliders = $obj.find(".slider");
            var slider = sliders[0];
            var $knobIcon = $obj.find(".knob .icon");


            var $switchLi = $obj.find("li");

            var RangeSlider = new MobileRangeSlider(slider, {
                min: 0,
                max: max,
                value: 0,
                change: function (value) {
                    var val, name;
                    val = self.calcuValue(value);
                    self._val = val;
                    name = opts.items[val].name;
                    $knobIcon.removeClass().addClass("icon icon_" + name + "_select");
                    $knobIcon.attr("value", name);
                    $switchLi.removeClass("selected");
                    $switchLi.eq(val).addClass("selected");


                }
            });

            self._RangeSlider = RangeSlider;


        },
        calcuValue: function (value) {
            var opts, size, remain, val;
            var self = this;
            opts = self._opts;
            size = opts.range / (opts.items.length - 1);

            val = value / size;
            remain = value % size;
            if (remain > size / 2) val++;
            val = parseInt(val);
            return val;

        },
        setWidth: function () {
            var self, $obj, $switchLi, length, width;

            self = this;
            $obj = self._$obj;
            $switchLi = $obj.find("li");
            length = $switchLi.length;
            width = $switchLi.eq(0).width() * 2 + $switchLi.eq(1).width() * (length - 2);
            $obj.width(width);
        },
        getVal: function () {
            var self = this;
            var val = self._val;
            return val;
        }
    };


    $.fn.dragSwitch = function (options) {
        var opts = $.extend({}, $.fn.dragSwitch.defaults, options);

        if ($.isPlainObject(opts)) {
            return this.each(function () {
                var $obj = $(this);
                var dragSwitchObj = Object.create(dragSwitch);
                dragSwitchObj.init(opts, $obj);
                $(this).data('dragSwitchObj', dragSwitchObj);

            });
        }
    };

    // Static method default options.
    $.fn.dragSwitch.defaults = {
        range: 60
    };


}(jQuery));
