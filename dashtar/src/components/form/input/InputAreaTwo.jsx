import { Input } from "@windmill/react-ui";

const InputAreaTwo = ({
  register,
  defaultValue,
  required,
  name,
  label,
  type,
  placeholder,
  readonly,
}) => {
  return (
    <>
      <Input
        {...register(`${name}`, {
          required: required ? false : `${label} is required!`,
        })}
        defaultValue={defaultValue}
        type={type}
        placeholder={placeholder}
        name={name}
        readonly={readonly}
        autoComplete="new-password"
        className="mr-2 p-2"
      />
    </>
  );
};

export default InputAreaTwo;
