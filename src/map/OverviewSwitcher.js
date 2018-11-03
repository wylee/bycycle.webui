import PluggableMap from 'ol/pluggablemap';
import TileLayer from 'ol/layer/tile';
import View from 'ol/view';


export default class OverviewSwitcher {
    constructor (mainMap, baseLayers) {
        this.mainMap = mainMap;

        let visible = false;
        this.baseLayers = baseLayers.map(layer => {
            const newLayer = new TileLayer({
                label: layer.get('label'),
                shortLabel: layer.get('shortLabel'),
                visible: visible,
                source: layer.getSource()
            });
            visible = layer.getVisible();
            return newLayer;
        });
        if (visible) {
            this.baseLayers[0].setVisible(true);
        }

        this.baseLayer = this.baseLayers.find(layer => layer.getVisible());

        this.map = new PluggableMap({
            controls: [],
            interactions: [],
            layers: this.baseLayers,
            view: new View()
        });

        this.view = this.map.getView();
    }

    initialize (target, options) {
        const map = this.map;
        const view = this.view;
        const mainMapView = this.mainMap.getView();

        map.setTarget(target);
        view.setCenter(options.center);
        view.setZoom(options.zoom);

        mainMapView.on('change:center', event => {
            view.setCenter(mainMapView.getCenter());
        });
    }

    setBaseLayerByIndex (index) {
        for (let layer of this.baseLayers) {
            layer.setVisible(false);
        }
        this.baseLayer = this.baseLayers[index];
        this.baseLayer.setVisible(true);
    }
}