// Import necessary modules from React and Fluent UI
import * as React from "react";
import { DetailsList, IColumn } from "@fluentui/react";

// Define the DataSet type alias from the component framework
type DataSet = ComponentFramework.PropertyTypes.DataSet;

// Define the interface for the component props
export interface IDatasetExampleProps {
  dataset: DataSet; // The dataset prop is of type DataSet
}

// Helper function to format elapsed time
const formatElapsedTime = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hrs = Math.floor(seconds / 3600);
  seconds -= hrs * 3600;
  const mins = Math.floor(seconds / 60);
  seconds -= mins * 60;
  const secs = Math.floor(seconds);

  let result = "";
  if (days > 0) result += `${days}d `;
  if (hrs > 0) result += `${hrs}h `;
  if (mins > 0) result += `${mins}m `;
  result += `${secs}s`;

  return result;
};

// Define the DatasetExample component
export const DatasetExample = React.memo(({ dataset }: IDatasetExampleProps): JSX.Element => {

  // Initialize state for items and columns using React's useState hook
  const [items, setItems] = React.useState<any[]>([]); // Items to be displayed in the DetailsList
  const [columns, setColumns] = React.useState<IColumn[]>([]); // Column configurations for the DetailsList

  // Log initial state
  console.log('Initial items state:', items);
  console.log('Initial columns state:', columns);

  // useEffect hook to set up columns and items when the dataset changes
  React.useEffect(() => {
    console.log('useEffect triggered with dataset:', dataset);

    // Set columns by sorting them based on the 'order' property and mapping to the required format
    const sortedColumns = dataset.columns
      .filter(column => column.name !== 'createdon') // Filter out 'createdon' column
      .sort((column1, column2) => column1.order - column2.order);
    console.log('Sorted columns:', sortedColumns);

    const mappedColumns: IColumn[] = sortedColumns.map((column) => {
      return {
        name: column.displayName, // Display name of the column
        fieldName: column.name, // Field name used to access data
        minWidth: column.visualSizeFactor, // Minimum width of the column
        key: column.name // Unique key for the column
      }
    });

    // Check if 'createdon' column exists in the original dataset
    const hasCreatedOn = dataset.columns.some(column => column.name === 'createdon');
    if (hasCreatedOn) {
      // Add the Elapsed Time column
      mappedColumns.push({
        name: 'Elapsed Time',
        fieldName: 'elapsedtime',
        minWidth: 100,
        key: 'elapsedtime'
      });
    }

    console.log('Mapped columns:', mappedColumns);
    setColumns(mappedColumns);

    // Create items by mapping over sortedRecordIds and extracting relevant data
    const myItems = dataset.sortedRecordIds.map((id, index, array) => {
      const entityId = dataset.records[id]; // Get the entity associated with the current id
      console.log(`Entity for id ${id}:`, entityId);

      const attributes = dataset.columns
        .filter(column => column.name !== 'createdon') // Filter out 'createdon' column
        .map((column) => {
          const formattedValue = entityId.getFormattedValue(column.name);
          console.log(`Formatted value for column ${column.name}:`, formattedValue);
          return { [column.name]: formattedValue }; // Extract formatted value for each column
        });

      let elapsedTime: string | null = null;
      if (hasCreatedOn && index > 0) {
        const previousEntityId = dataset.records[array[index - 1]];
        const currentCreatedOn = new Date(entityId.getFormattedValue('createdon')).getTime();
        const previousCreatedOn = new Date(previousEntityId.getFormattedValue('createdon')).getTime();
        const elapsedSeconds = (currentCreatedOn - previousCreatedOn) / 1000; // Elapsed time in seconds
        elapsedTime = formatElapsedTime(elapsedSeconds); // Format the elapsed time
        console.log(`Elapsed time for row ${index}:`, elapsedTime);
      }

      // Combine the entity attributes and additional metadata into a single object
      const item = Object.assign({
        key: entityId.getRecordId(), // Unique key for the item
        raw: entityId // Raw entity data
      }, ...attributes, { elapsedtime: elapsedTime });

      console.log('Constructed item:', item);
      return item;
    });

    console.log('Final items array:', myItems);
    setItems(myItems);
  }, [dataset]); // Dependencies array ensures this effect runs when 'dataset' changes

  // Log state before render
  console.log('Items state before render:', items);
  console.log('Columns state before render:', columns);

  // Render the DetailsList component with the items and columns
  return (
    <DetailsList
      items={items} // Pass the items state to the DetailsList
      columns={columns} // Pass the columns state to the DetailsList
    />
  );
});
