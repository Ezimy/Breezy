import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const LocationDropdown = ({ options = [], selectedValue, onChange }) => {
  return (
    <FormControl
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "white" },
          "&:hover fieldset": { borderColor: "white" },
          "&.Mui-focused fieldset": { borderColor: "white" },
        },
        width: "100%",
      }}
    >
      <InputLabel
        sx={{
          color: "white !important",
          "&.Mui-focused": {
            color: "white !important",
          },
        }}
      >
        Select a Location
      </InputLabel>
      <Select
        value={selectedValue}
        onChange={onChange}
        label="Select a Location"
        sx={{
          color: "white",
          "& .MuiSelect-icon": { color: "white" },
        }}
      >
        {options.length > 0 ? (
          options.map((location, index) => {
            const labelParts = [
              location.name,
              location.state,
              location.country,
            ].filter(Boolean);
            const label = labelParts.join(", ");

            return (
              <MenuItem
                key={index}
                value={JSON.stringify([
                  location.lat,
                  location.lon,
                  location.state,
                ])}
              >
                {label}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem disabled>No options available</MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default LocationDropdown;
