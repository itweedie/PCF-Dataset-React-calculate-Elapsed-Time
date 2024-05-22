// Import necessary types and components
import { IInputs, IOutputs } from "./generated/ManifestTypes"; // Import input and output types from generated manifest types
import { DatasetExample, IDatasetExampleProps } from "./DatasetExample"; // Import the DatasetExample component and its props interface
import * as React from "react"; // Import React
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi; // Alias for DataSet API interfaces
type DataSet = ComponentFramework.PropertyTypes.DataSet; // Alias for DataSet type

// Define the main class for the PCF control, implementing the ReactControl interface
export class pcfName implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>; // Reference to the React control component
    private notifyOutputChanged: () => void; // Callback to notify the framework of output changes

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged; // Assign the notifyOutputChanged callback to the class property
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const props: IDatasetExampleProps = { dataset : context.parameters.dataset }; // Map context parameters to DatasetExample props
        return React.createElement(
            DatasetExample, props // Create and return the DatasetExample React element with props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return { }; // Return an empty object as this control has no outputs
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
