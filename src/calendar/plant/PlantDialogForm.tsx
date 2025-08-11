import { useState } from 'react';
import type { InputChangeEvent } from '../../types/ChangeEvents';
import { CROPS_BY_ID, CROPS_BY_SEASON } from '../../constants/tables/Crops';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import type { Season } from '../../constants/enums/Seasons';

export interface PlantFormFields {
  cropId: string;
  seedPrice: number;
  amount: number;
  growthDay?: number;
  autoplant?: boolean;
}

export default function PlantDialogForm({
  season,
  onPlant,
}: {
  season: Season;
  onPlant: (fields: PlantFormFields) => void;
}) {
  const seasonalCrops = CROPS_BY_SEASON[season];

  const [errorsByField, setErrorsByField] = useState<Record<string, string>>(
    {},
  );

  const [cropId, setCropId] = useState<string>(seasonalCrops[0]?.id);
  const handleCropChange = (event: InputChangeEvent) => {
    const newCropId = event.target.value;
    setCropId(newCropId);
    setSeedPrice(CROPS_BY_ID[newCropId]?.buyPrices?.[0] ?? 0);
  };

  const [seedPrice, setSeedPrice] = useState<number>(
    CROPS_BY_ID[cropId]?.buyPrices?.[0] ?? 0,
  );
  const handleSeedPriceChange = (event: InputChangeEvent) =>
    setSeedPrice(parseInt(event.target.value, 10));

  const [amount, setAmount] = useState<number>(1);
  const handleAmountChange = (event: InputChangeEvent) =>
    setAmount(parseInt(event.target.value, 10));

  const [growthDay, setGrowthDay] = useState<number>(-1);
  const handleGrowthDayChange = (event: InputChangeEvent) => {
    const newGrowthDay = event.target.value;
    setGrowthDay(parseInt(newGrowthDay, 10));
  };

  const handlePlant = (_event: unknown, autoplant: boolean = false) => {
    const fields: Partial<PlantFormFields> = { autoplant };

    const crop = CROPS_BY_ID[cropId];
    if (!crop) {
      setErrorsByField({
        ...errorsByField,
        crop: `Crop '${cropId}' is invalid.`,
      });
      return;
    }

    fields.cropId = cropId;
    fields.seedPrice = seedPrice < 0 ? 0 : seedPrice;
    fields.amount = amount < 0 ? 0 : amount;

    if (growthDay && growthDay > 0) {
      fields.growthDay = growthDay;
    }

    setErrorsByField({});
    return onPlant(fields as PlantFormFields);
  };
  const handleAutoplant = (event: unknown) => handlePlant(event, true);

  return (
    <>
      <Box className="plant-dialog-form">
        <TextField
          id="plant-dialog-crop-select"
          select
          label="Crop"
          value={cropId}
          onChange={handleCropChange}
          error={!!errorsByField.crop}
          helperText={errorsByField.crop}
        >
          {seasonalCrops.map((crop) => (
            <MenuItem key={crop.id} value={crop.id}>
              {crop.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="plant-dialog-price-select"
          select
          label="Seed Price"
          value={seedPrice}
          onChange={handleSeedPriceChange}
          error={!!errorsByField.seedPrice}
          helperText={errorsByField.seedPrice}
        >
          {cropId &&
            CROPS_BY_ID[cropId]?.buyPrices?.map((price) => (
              <MenuItem key={`${cropId}-seed-${price}`} value={price}>
                {price}t
              </MenuItem>
            ))}
          <MenuItem value={0}>0t</MenuItem>
        </TextField>
        <TextField
          id="plant-dialog-amount"
          type="number"
          label="Amount"
          slotProps={{ htmlInput: { min: 1 } }}
          value={amount}
          onChange={handleAmountChange}
          error={!!errorsByField.amount}
          helperText={errorsByField.amount}
        />
        <TextField
          id="plant-dialog-growth-select"
          select
          label="Growth Spell Used On Day"
          value={growthDay}
          onChange={handleGrowthDayChange}
          error={!!errorsByField.growthDay}
          helperText={errorsByField.growthDay}
        >
          <MenuItem value="-1">N/A</MenuItem>
          {cropId &&
            Array(CROPS_BY_ID[cropId].daysToGrow)
              .fill(0)
              ?.map((_, day) => (
                <MenuItem key={`${cropId}-growth-${day}`} value={day}>
                  Day {day}
                </MenuItem>
              ))}
        </TextField>
      </Box>
      <Box>
        <Button
          onClick={handlePlant}
          variant="contained"
          startIcon={<GrassOutlinedIcon />}
        >
          Plant
        </Button>
        {!CROPS_BY_ID[cropId]?.daysToRegrow && (
          <Button
            onClick={handleAutoplant}
            variant="contained"
            startIcon={<CalendarMonthOutlinedIcon />}
          >
            Autoplant
          </Button>
        )}
      </Box>
    </>
  );
}
