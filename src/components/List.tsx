import {
  CircularProgress,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect, createRef } from 'react';

import { PlaceDetails } from './';
import type { TypeListProps } from '../@types';

const List = ({
  places,
  childClicked,
  isLoading,
  value,
  setValue,
  rating,
  setRating,
}: TypeListProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ padding: '30px' }}>
      <Typography variant="h4">
        Attractions, Hotels &amp; Restaurants near you
      </Typography>

      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: '600px' }}
        >
          <CircularProgress size="5rem" />
        </Box>
      ) : (
        <Box>
          <FormControl
            sx={{ margin: `${theme.spacing(1)}`, minWidth: 120, marginBottom: '30px' }}
          >
            <InputLabel>Option</InputLabel>
            <Select value={value} onChange={(e) => setValue(e.target.value)}>
              
              <MenuItem value="attractions">Attractions</MenuItem>
              <MenuItem value="hotels">Hotels</MenuItem>
              <MenuItem value="restaurants">Restaurants</MenuItem>
              
            </Select>
          </FormControl>

          <FormControl
            sx={{ margin: `${theme.spacing(1)}`, minWidth: 120, marginBottom: '30px' }}
          >
            <InputLabel>Rating</InputLabel>
            <Select value={rating} onChange={(e) => setRating(e.target.value)}>
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value={3}>Above 3 Stars</MenuItem>
              <MenuItem value={4}>Above 4 Stars</MenuItem>
              <MenuItem value={4.5}>Above 4.5 Stars</MenuItem>
            </Select>
          </FormControl>

          <Grid container spacing={3} sx={{ height: '75vh', overflow: 'auto' }}>
            {places?.map((place, index) => (
              <Grid item key={index} xs={12}>
                <PlaceDetails place={place} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default List;
