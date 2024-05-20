import Image from "next/image";
import { links } from "@constants/config";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { strings } from "@strings";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Checkbox,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import "dotenv/config";
// import { Google } from "@icons-pack/react-simple-icons";
const Register = () => {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["Select size"]));
  const [selectedCountry, setSelectedCountry] = useState(
    new Set(["Select country"])
  );
  const [countryList, setCountryList] = useState();
  const [keepSelected, setKeepSelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const onKeepUpdate = () => setKeepSelected(!keepSelected);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  const getCountryList = async () => {
    try {
      const response = await axios.get(
        "https://profound-corgi-expert.ngrok-free.app/api/country"
      );
      console.log("country res-->", await response);
      console.log("country res.data-->", await response.data.data);
      setCountryList(response.data.data);
    } catch (error) {
      console.error("Error fetch data:", error.message);
      // setError("Error posting data");
    }
  };
  const orgSizeList = [
    {
      size: "1-19",
    },
    {
      size: "20-49",
    },
    {
      size: "50-99",
    },
    {
      size: "100-250",
    },
    {
      size: "251-250",
    },
    {
      size: "501-1500",
    },
    {
      size: "1500+",
    },
  ];
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      organizationName: "",
      organizationAddress: "",
    },
  });

  const onSubmit = async (data) => {
    // setLoginButton(true);
    console.log("on submit data->", data);
    return;
    const body = {
      // name: data?.name,
    };
    await contactUsAPI(body).then(() => {
      reset();
      setLoginButton(false);
    });
  };

  useEffect(() => {
    getCountryList();
  }, []);
  return (
    <div className="bg-white min-h-screen">
      {/* <p
        className="text-center bg-red-500 "
        style={{ textTransform: "capitalize" }}
      >
        register
      </p> */}
      <Image
        src={links.ImgAuthBanner}
        style={{
          height: 400,
          width: "80%",
        }}
        alt="Picture of the author"
      />
      <div className="container mx-auto mt-3 flex flex-wrap flex-row justify-between ">
        {/* left side */}
        <div>
          <h1 className="text-48 black  font-bold text-black">Register to</h1>
          <h2 className="text-48 font-bold text-primary">Manage</h2>
          <h3 className="text-48 font-bold text-black mb-8">
            the new experience
          </h3>
          <div>
            <p className="custom-20 text-black">
              If you have an account
              <br /> you can{" "}
              <Link href="">
                <span className="text-20 text-primary font-medium">
                  logIn here
                </span>
              </Link>
            </p>
          </div>
        </div>
        {/* right side */}
        <div
          className="w-[600px] rounded-md bg-white border px-12 py-5 my-0 border border-borderColor"
          style={{
            position: "absolute",
            right: "10%",
            top: "50%",
            transform: "translateY(-50%)",
            width: "600px",
          }}
        >
          <p className="text-black text-center font-bold text-32">
            Welcome to smarTScrum
          </p>
          <p className="text-center font-normal text-16 text-darkGrayishBlue mt-3">
            A Warm welcome <br /> to the new era of the project management
            application
          </p>
          <div className="container mt-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-row gap-5 w-[100%]">
                {/* first name */}
                <div className="flex-1">
                  <label className="text-12 font-bold">
                    {strings.firstNameLabel}
                    <span className="text-darkRed">*</span>
                  </label>

                  <input
                    {...register("firstName", {
                      required: strings.firstNamePh,
                      maxLength: {
                        value: 20,
                      },
                    })}
                    data-testid={"firstName"}
                    type="input"
                    className="w-full border rounded-md px-4 py-2 mt-1 text-darkGray text-14 font-normal border-inputBorderColor"
                    id="firstName"
                    placeholder={strings.firstNamePh}
                    name="firstName"
                  />
                  <span className="text-darkRed text-12 font-normal">
                    {errors.firstName?.message}
                  </span>
                </div>
                {/* last name */}
                <div className="flex-1 ">
                  <label className="text-12 font-bold">
                    {strings.lastNameLabel}
                  </label>

                  <input
                    {...register("lastName", {
                      maxLength: {
                        value: 15,
                      },
                    })}
                    data-testid={"lastName"}
                    type="input"
                    className="w-full border rounded-md px-4 py-2 mt-1 text-darkGray text-14 font-normal border-inputBorderColor"
                    id="lastName"
                    placeholder={strings.lastNamePh}
                    name="lastName"
                  />
                </div>
              </div>
              {/* email */}
              <div className="mt-3">
                <label className="text-12 font-bold">
                  {strings.emailLabel} <span className="text-darkRed">*</span>
                </label>

                <input
                  {...register("email", {
                    required: strings.emailReq,
                    maxLength: {
                      value: 50,
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: strings.emailInvalidMsg,
                    },
                  })}
                  data-testid={"email"}
                  type="input"
                  className=" w-full border rounded-md  px-4 py-2 mt-1  text-darkGray text-14 font-normal border-inputBorderColor"
                  id="email"
                  placeholder={strings.emailPh}
                  name="email"
                />

                <span className="text-darkRed text-12 font-normal">
                  {errors.email?.message}
                </span>
              </div>
              {/* password */}
              <div className="mt-3">
                <label className="text-12 font-bold">
                  {strings.passLabel} <span className="text-darkRed">*</span>
                </label>
                <div>
                  <input
                    {...register("password", {
                      required: strings.passLabelReq,
                      maxLength: {
                        value: 10,
                      },
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/i,
                        message: strings.passwordMust,
                      },
                    })}
                    data-testid={"password"}
                    type={showPassword ? "text" : "password"}
                    className="flex w-full border rounded-md px-4 py-2 mt-1 text-darkGray text-14 font-normal border-inputBorderColor"
                    id="password"
                    placeholder={strings.passLabelPh}
                    name="password"
                  />
                  <span
                    className="absolute"
                    style={{
                      right: "10%",
                      marginTop: -25,
                    }}
                    onClick={togglePasswordVisibility}
                  >
                    <Icon
                      icon={showPassword ? "bi:eye-slash" : "bi:eye"}
                      className="text-darkGray"
                    />
                  </span>
                </div>
                <span className="text-darkRed text-12 font-normal">
                  {errors.password?.message}
                </span>
              </div>

              {/* confirm password */}

              <div className="mt-3">
                <label className="text-12 font-bold">
                  {strings.confirmPassLabel}
                  <span className="text-darkRed"> *</span>
                </label>
                <div>
                  <input
                    {...register("confirmPassword", {
                      required: strings.confirmPassLabelReq,
                      validate: (value) =>
                        value === getValues("password") ||
                        strings.confirmPassVali,
                      maxLength: {
                        value: 10,
                      },
                    })}
                    data-testid={"confirmPassword"}
                    type={showConfirmPassword ? "text" : "password"}
                    className="flex w-full border rounded-md px-4 py-2 mt-1 text-darkGray text-14 font-normal border-inputBorderColor"
                    id="confirmPassword"
                    placeholder={strings.confirmPassLabelPh}
                    name="confirmPassword"
                  />
                  <span
                    className="absolute"
                    style={{
                      right: "10%",
                      marginTop: -25,
                    }}
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <Icon
                      icon={showConfirmPassword ? "bi:eye-slash" : "bi:eye"}
                      className="text-darkGray"
                    />
                  </span>
                </div>
                <span className="text-darkRed text-12 font-normal">
                  {errors.confirmPassword?.message}
                </span>
              </div>

              {/* organization name */}
              <div className="mt-3">
                <label className="text-12 font-bold">
                  {strings.orgNameLabel} <span className="text-darkRed">*</span>
                </label>

                <input
                  {...register("organizationName", {
                    required: strings.orgNameReq,
                    maxLength: {
                      value: 30,
                    },
                  })}
                  data-testid={"organizationName"}
                  type="input"
                  className=" w-full border rounded-md  px-4 py-2 mt-1  text-darkGray text-14 font-normal border-inputBorderColor"
                  id="organizationName"
                  placeholder={strings.orgNamePh}
                  name="organizationName"
                />

                <span className="text-darkRed text-12 font-normal">
                  {errors.organizationName?.message}
                </span>
              </div>
              {/* organization address */}
              <div className="mt-3">
                <label className="text-12 font-bold">
                  {strings.orgAddressLabel}
                  <span className="text-darkRed">*</span>
                </label>

                <input
                  {...register("organizationAddress", {
                    required: strings.orgAddressReq,
                    maxLength: {
                      value: 150,
                    },
                  })}
                  data-testid={"organizationAddress"}
                  type="input"
                  className=" w-full border rounded-md  px-4 py-2 mt-1 text-darkGray text-14 font-normal border-inputBorderColor"
                  id="organizationAddress"
                  placeholder={strings.orgAddressPh}
                  name="organizationAddress"
                />

                <span className="text-darkRed text-12 font-normal">
                  {errors.organizationAddress?.message}
                </span>
              </div>

              {/* organization size dropdown */}
              <div className="mt-3 col-12  flex flex-row gap-5 w-[100%]">
                <div>
                  <label className="text-12 font-bold">
                    {strings.orgDropdownLabel}
                    <span className="text-darkRed"> *</span>
                  </label>
                  <Dropdown style={{}}>
                    <DropdownTrigger className=" mt-1">
                      <Button
                        variant="bordered"
                        className="w-[100%] bg-primary text-white font-normal capitalize"
                      >
                        {selectedValue}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Dynamic Actions"
                      selectionMode="single"
                      selectedKeys={selectedKeys}
                      onSelectionChange={setSelectedKeys}
                      items={orgSizeList}
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      {(item) => {
                        item.key = item.size;
                        return (
                          <DropdownItem key={item.key}>
                            {item.size}
                          </DropdownItem>
                        );
                      }}
                    </DropdownMenu>
                  </Dropdown>
                </div>
                {/* country dropdown */}
                <div className="">
                  <label className="text-12 font-bold">
                    {strings.countryLable}
                    <span className="text-darkRed"> *</span>
                  </label>
                  <Dropdown className="w-1/2 " style={{}}>
                    <DropdownTrigger className="w-1/2 mt-1">
                      <Button
                        variant="bordered"
                        className="w-[100%] bg-primary text-white font-normal capitalize"
                      >
                        {selectedCountry}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Dynamic Actions"
                      selectionMode="single"
                      selectedKeys={selectedCountry}
                      onSelectionChange={setSelectedCountry}
                      items={countryList}
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      {(item) => {
                        // console.log("iten0>", item);
                        item.key = item.Name;
                        return (
                          <DropdownItem key={item.key}>
                            {item.Name}
                          </DropdownItem>
                        );
                      }}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
              <div className="mt-3 ">
                <Checkbox
                  radius="sm"
                  isSelected={keepSelected}
                  onValueChange={setKeepSelected}
                >
                  <p className="ml-1 text-14 font-normal text-darkGray">
                    Keep me updated about the new features and upcoming
                    improvements (by doing this you accept the
                    <span className="text-primary"> terms</span> and{" "}
                    <span className="text-primary">the privacy policy</span>
                    ).
                  </p>
                </Checkbox>
              </div>
              {/* bottom view */}

              <Button
                onClick={() => {
                  // Handle Google Sign-In logic here
                }}
                className="text-48 p-2 border rounded-md mt-3 bg-primary w-full font-medium text-white text-center items-center "
              >
                Let’s Start
              </Button>
              <p className="text-primary text-center text-14 font-medium my-1">
                or
              </p>
              <div className="flex  justify-center items-center">
                <Button
                  onClick={() => {
                    // Handle Google Sign-In logic here
                    window.open(
                      `${process.env.API_URL}/auth/google/callback`,
                      "_self"
                    );
                  }}
                  className="bg-white border border-primary "
                  startContent={
                    <Image
                      src={links.ImgGoogle}
                      style={{
                        height: 25,
                        width: 25,
                        borderRadius: 50,
                      }}
                      alt="Picture of the author"
                    />
                  } // Render the image as end content
                >
                  Continue with Google
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
