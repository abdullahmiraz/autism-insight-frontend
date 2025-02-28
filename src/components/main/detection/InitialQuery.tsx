/* eslint-disable @typescript-eslint/no-explicit-any */

import SelectInput from "./SelectInput";

interface InitialQueryProps {
  register: any;
}

export default function InitialQuery({ register }: InitialQueryProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Age in Months */}
        <div>
          <label className="block font-semibold">
            Age (Months- max 5 years)
          </label>
          <input
            type="number"
            {...register("age_mons", { required: true })}
            min={1}
            max={60}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Qchat-10 Score */}
        {/* <div>
          <label className="block font-semibold">Qchat-10 Score</label>
          <input
            type="number"
            {...register("qchat_10_score", { required: true })}
            min={0}
            max={10000}
            className="w-full p-2 border rounded-md"
          />
        </div> */}

        {/* Sex */}
        <SelectInput
          label="Sex"
          name="sex"
          options={["Male", "Female"]}
          register={register}
          required={true}
        />

        {/* Jaundice */}
        <SelectInput
          label="Jaundice"
          name="jaundice"
          options={["No", "Yes"]}
          register={register}
          required={true}
        />

        {/* Family Member with ASD */}
        <SelectInput
          label="Family Member with ASD"
          name="family_mem_with_asd"
          options={["No", "Yes"]}
          register={register}
          required={true}
        />

        {/* Who completed the test */}
        {/* <SelectInput
          label="Who completed the test?"
          name="who_completed_test"
          options={["Family Member", "Health Care Professional"]}
          register={register}
          required={true}
        /> */}
      </div>
      {/* Ethnicity */}
      <SelectInput
        label="Ethnicity"
        name="ethnicity"
        options={[
          "Middle Eastern",
          "White European",
          "Hispanic",
          "Black",
          "Asian",
          "South Asian",
        ]}
        register={register}
        required={true}
      />
    </div>
  );
}
