import React from "react";
import PropTypes from "prop-types";
import ItemUtility from "../utility/ItemUtility";
import BuildModel from "../models/BuildModel";
import PerkString from "./PerkString";
import ElementalAffinities from "./ElementalAffinities";
import PropTypeUtility from "../utility/PropTypeUtility";

export default class ItemData extends React.Component {

    render() {
        const levelString = ItemUtility.levelString(this.props.level);
        const perkElement = <PerkString perks={
            BuildModel.getAvailablePerksByLevel(this.props.item.name,
                ItemUtility.itemType(this.props.item.type),
                this.props.level
            )
        } />;

        let uniqueEffects = [];

        if(this.props.item.unique_effects) {
            uniqueEffects = BuildModel.getAvailableUniqueEffectsByLevel(
                this.props.item.name, ItemUtility.itemType(this.props.item.type),
                this.props.level)
                .map(
                    uniqueEffect =>
                        <div key={uniqueEffect.name} className="unique-effects">{uniqueEffect.description}</div>);
        }

        let stats = null;

        switch(ItemUtility.itemType(this.props.item.type)) {
            case "Weapon":
                stats = <React.Fragment>
                    <div className="stat-data">
                        <strong>Power</strong>: {this.props.item.power[this.props.level]} <ElementalAffinities item={this.props.item} />
                    </div>
                    {perkElement}
                </React.Fragment>;
                break;
            case "Armour":
                stats = <React.Fragment>
                    <div className="stat-data">
                        <strong>Resistance</strong>: {this.props.item.resistance[this.props.level]} <ElementalAffinities item={this.props.item} />
                    </div>
                    {perkElement}
                </React.Fragment>;
                break;
            case "Lantern": {
                let instant = null;
                let hold = null;

                if(this.props.item.lantern_ability.instant) {
                    instant = <div><strong>Instant</strong>: {this.props.item.lantern_ability.instant}</div>;
                }

                if(this.props.item.lantern_ability.hold) {
                    hold = <div><strong>Hold</strong>: {this.props.item.lantern_ability.hold}</div>;
                }

                stats = <React.Fragment>
                    {instant}
                    {hold}
                    {perkElement}
                </React.Fragment>;
            }
        }

        let cellLine = null;

        if(this.props.renderCellLine) {
            cellLine = this.renderCellLine(this.props.item);
        }

        return <div className="item-data">
            <h3 className="item-title">{this.props.item.name} {levelString}</h3>
            {stats}
            {cellLine}
            {uniqueEffects}
        </div>;
    }

    renderCellLine(item) {
        let cellLine = null;

        let cells = item.cells;

        if(!Array.isArray(cells)) {
            cells = [cells];
        }

        if(item.cells) {
            let cellLineCounter = 0;

            cellLine = <div className="cell-slots">{cells.map(cell =>
                <span key={"CellLine_" + cell + (cellLineCounter++)} className="cell-line">
                    <img className="cell-icon" src={"/assets/icons/perks/" + cell + ".png"} /> {cell}
                </span>
            )}</div>;
        }

        return cellLine;
    }
}

ItemData.propTypes = {
    item: PropTypeUtility.item(),
    level: PropTypes.number,
    renderCellLine: PropTypes.bool
};