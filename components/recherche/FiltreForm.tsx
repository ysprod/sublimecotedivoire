// app/recherche/components/FiltreForm.tsx
'use client';

import { CartoFiltre, OptionValue } from "@/lib/libs/interface";
import { Input } from "antd";
import { memo } from "react";
import SelectInput from "../../components/commons/SelectInput";
import ValidateButton from "../../components/commons/ValidateButton";

interface FiltreFormProps {
  carto: CartoFiltre;
  regionOptions: OptionValue[];
  departementOptions: OptionValue[];
  fieldStates: {
    isDepartementDisabled: boolean;
    isCommuneDisabled: boolean;
    isFormValid: boolean;
  };
  onUpdate: (field: keyof CartoFiltre) => (value: any) => void; // Correction du type
  onValidate: () => void;
}

export const FiltreForm = memo(({
  carto,
  regionOptions,
  departementOptions,
  fieldStates,
  onUpdate,
  onValidate,
}: FiltreFormProps) => {
  return (
    <div className="space-y-4">
      <SelectInput
        label="Région / District Autonome"
        value={carto.regionId || ''}
        onChange={onUpdate('regionId')}
        options={regionOptions}
        placeholder="Sélectionnez une région"
      />

      <SelectInput
        label="Département"
        value={carto.departementId || ''}
        onChange={onUpdate('departementId')}
        disabled={fieldStates.isDepartementDisabled}
        options={departementOptions}
        placeholder={
          fieldStates.isDepartementDisabled
            ? "Sélectionnez d'abord une région"
            : "Sélectionnez un département"
        }
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Localité/Commune
        </label>
        <Input
          value={carto.localite || ''}
          onChange={onUpdate('localite')}
          disabled={fieldStates.isCommuneDisabled}
          placeholder="Localité/Commune"
          className="w-full rounded-lg"
        />
      </div>

      <div className="pt-4 flex justify-center">
        <ValidateButton
          onClick={onValidate}
          disabled={!fieldStates.isFormValid}
        />
      </div>
    </div>
  );
});

FiltreForm.displayName = "FiltreForm";