
         

        /**
        * The help tooltip element.
        * @type {HTMLElement}
        */

        /**
        * Overlay to show the help messages.
        * @type {Overlay}
        */

        /**
        * Creates a new help tooltip
        */
        function createHelpTooltip() {
            if (helpTooltipElement) {
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }
            helpTooltipElement = document.createElement('div');
            helpTooltipElement.className = 'ol-tooltip hidden';
            helpTooltip = new ol.Overlay({
                element: helpTooltipElement,
                offset: [15, 10],
                positioning: 'center-left',
            });
            map.addOverlay(helpTooltip);
        }

        // map.getViewport().addEventListener('mouseout', function () {
        //     helpTooltipElement.classList.add('hidden');
        // });

        /**
        * The measure tooltip element.
        * @type {HTMLElement}
        */


        /**
        * Overlay to show the measurement.
        * @type {Overlay}
        */

        /**
        * Creates a new measure tooltip
        */

        function createMeasureTooltip() {
            if (measureTooltipElement) {
                measureTooltipElement.parentNode.removeChild(measureTooltipElement);
                console.log("MeasureTooltip", measureTooltipElement);
            }
            measureTooltipElement = document.createElement('div');
            measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
            measureTooltip = new ol.Overlay({
                element: measureTooltipElement,
                offset: [0, -15],
                positioning: 'bottom-center',
            });
            map.addOverlay(measureTooltip);
        }

