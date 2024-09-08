import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Card, CardContent } from '@mui/material';
import ComboBox from 'app/shared-components/ComboBox';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
// import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
// import InputLabel from '@mui/material/InputLabel';
// import OutlinedInput from '@mui/material/OutlinedInput';
import jwtServiceConfig from 'src/app/auth/services/jwtService/jwtServiceConfig';
import { useState } from 'react';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const defaultValues = {
  reportName: null,
  ReportColumns: [],
};

const schema = yup.object().shape({
  reportName: yup.object().nullable().required('You must select the Report Name'),
  ReportColumns: yup
    .array()
    .min(1, 'You must select at least one Column Name')
    .of(yup.string().required('You must select the Column Name')),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function DynamicReport() {
  const [personName, setPersonName] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  console.log('selectedColumns', selectedColumns);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleReportNameChange = (v) => {
    console.log('handle', v);
    setPersonName([
      'Oliver Hansen',
      'Van Henry',
      'April Tucker',
      'Ralph Hubbard',
      'Omar Alexander',
      'Carlos Abbott',
      'Miriam Wagner',
      'Bradley Wilkerson',
      'Virginia Andrews',
      'Kelly Snyder',
    ]);
  };

  // const handleColumnSelectChange = (event) => {
  //   console.log('HandleColumnSelectedChange', event);
  //   setSelectedColumns(event || []); // Update selected columns
  // };

  const handleColumnSelectChange = (name) => () => {
    console.log('Name', name);
    const selectedIndex = selectedColumns.indexOf(name);
    console.log('selectedIndex', selectedIndex);
    let newSelected = [...selectedColumns];
    console.log('newSelected', newSelected);

    if (selectedIndex === -1) {
      newSelected = [...newSelected, name];
    } else {
      newSelected.splice(selectedIndex, 1);
    }
    console.log('newSelected', newSelected);
    setSelectedColumns(newSelected);
  };

  const onSubmit = (data) => {
    console.log('Data', data);

    console.log('Selected Data:', {
      reportName: data.reportName,
      ReportColumns: selectedColumns,
    });
  };

  const finalSpaceCharacters = [
    {
      name: 'Gary Goodspeed',
    },
    {
      name: 'Goodspeed',
    },
  ];

  const onDragEnd = (result) => {
    // Handle drag end logic here
    const items = Array.from(selectedColumns);
    console.log('Item', items);
    const [reorderedItem] = items.splice(result.source.index, 1);
    console.log('reorderedItem', [reorderedItem]);
    items.splice(result.destination.index, 0, reorderedItem);
    console.log('Items', items);

    setSelectedColumns(items);
  };

  // const DraggableMenuItem = ({ name, index }) => {
  //   return (
  //     <Draggable draggableId={name} index={index}>
  //       {(provided) => (
  //         <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
  //           <MenuItem component={Paper} style={{ marginBottom: 8 }}>
  //             <ArrowRightIcon />
  //             <ListItemText primary={name} />
  //           </MenuItem>
  //         </div>
  //       )}
  //     </Draggable>
  //   );
  // };

  return (
    <div className="p-24">
      <h3 className="text-[#262351] text-normal font-bold mb-12">Dynamic Report</h3>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={4}>
                    <Controller
                      name="reportName"
                      control={control}
                      render={({ field }) => (
                        <ComboBox
                          field={field}
                          label="Report Name"
                          fullWidth
                          required
                          error={!!errors.reportName}
                          helperText={errors.reportName?.message}
                          url={jwtServiceConfig.listGeneralMaster}
                          data={{ GM_REFERENCE_CODE: 'TRUCK_SIZE_TYPE', GM_STATUS: 'A' }}
                          displayExpr="gm_name_code"
                          valueExpr="gm_id"
                          handleChange={(v) => handleReportNameChange(v)}
                        />
                      )}
                    />
                  </Grid>
                  {/* <Grid item xs={12} lg={4}>
                    <Controller
                      name="ReportColumns" // Provide a unique name for the field
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="demo-multiple-checkbox-label">Report Columns</InputLabel>
                          <Select
                            {...field}
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            fullWidth
                            required
                            error={!!errors.ReportColumns && selectedColumns.length === 0}
                            // helperText={errors.ReportColumns?.message}
                            value={selectedColumns}
                            input={<OutlinedInput label="Report Columns" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            onChange={handleColumnSelectChange}
                          >
                            {personName.length === 0 ? (
                              <MenuItem disabled>
                                <ListItemText primary="No data found" />
                              </MenuItem>
                            ) : (
                              personName.map((name) => (
                                <MenuItem key={name} value={name}>
                                  <Checkbox
                                    checked={selectedColumnsList.indexOf(name) > -1}
                                    onClick={handleSelectChange(name)}
                                  />
                                  <ListItemText primary={name} />
                                </MenuItem>
                              ))
                            )}
                          </Select>
                          {!!errors.ReportColumns && selectedColumns.length === 0 && (
                            <Typography variant="caption" color="error">
                              {errors.ReportColumns.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <Button type="submit">Submit</Button>
                  </Grid> */}
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card>
            <CardContent>
              <h3 className="text-[#262351] text-normal font-bold mb-12">List Of columns</h3>
              <hr />
              {personName.length === 0 ? (
                <MenuItem disabled>
                  <ListItemText primary="No data found" />
                </MenuItem>
              ) : (
                personName.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox
                      checked={selectedColumns.indexOf(name) > -1}
                      onClick={handleColumnSelectChange(name)}
                    />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={6}>
          <Card>
            <CardContent>
              <h3 className="text-[#262351] text-normal font-bold mb-12">Selected Columns</h3>
              <hr />
              {selectedColumns.length === 0 ? (
                <MenuItem disabled>
                  <ListItemText primary="No data found" />
                </MenuItem>
              ) : (
                selectedColumns.map((name) => (
                  <MenuItem key={name} value={name}>
                    <ArrowRightIcon />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))
              )}
            </CardContent>
          </Card>
        </Grid> */}

        <Grid item xs={6}>
          <Card>
            <CardContent>
              <h3 className="text-[#262351] text-normal font-bold mb-12">Selected Columns</h3>
              <hr />
              {selectedColumns.length === 0 ? (
                <MenuItem disabled>
                  <ListItemText primary="No data found" />
                </MenuItem>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="characters">
                    {(provided) => (
                      <div
                        className="characters"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {selectedColumns.map((name, index) => (
                          <Draggable key={name} draggableId={name} index={index}>
                            {(providedDraggable) => (
                              <MenuItem
                                {...providedDraggable.draggableProps}
                                {...providedDraggable.dragHandleProps}
                                ref={providedDraggable.innerRef}
                                key={name}
                                value={name}
                              >
                                <ArrowRightIcon />
                                <ListItemText primary={name} />
                              </MenuItem>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default DynamicReport;
