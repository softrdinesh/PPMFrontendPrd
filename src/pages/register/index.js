import { useEffect, useMemo, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import "dotenv/config";
import { Button, Checkbox } from "@nextui-org/react";

import { Loader } from "../../components/Loader/Loader";
import { createUser, fetchCountryList } from "../../utils/apiService";
import { strings } from "@strings";
import { links } from "@constants/config";
import { AuthContext } from "src/context/authContext";
import { Router } from "next/router";
import { route } from "@constants/route";

const Register = () => {
  const { user, loading, login } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrgSize, setSelectedOrgSize] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [keepSelected, setKeepSelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const getCountryList = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCountryList();
      setCountryList(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
    setValue,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      organizationName: "",
      organizationAddress: "",
      country: selectedCountry,
    },
  });
  // setvalues when comeback from google signup
  useEffect(() => {
    if (user) {
      let data = user?.userData;
      setValue("firstName", data?.Name || "");
      setValue("email", data?.Email || "");
      // Add other fields as necessary
    }
  }, [user, setValue]);
  const onSubmit = async (data) => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const body = {
        name: data?.firstName + data?.lastName,
        email: data?.email,
        password: data?.password,
        countryID: selectedCountry,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: data?.organizationAddress,
        organizationName: data?.organizationName,
        organizationSize: selectedOrgSize,
      };

      try {
        const response = await createUser(body);
        if (response.status) {
          Router.push(route.dashboard);
        }
        setIsLoading(false);
        reset();
      } catch (error) {
        setIsLoading(false);
      }
    });
  };
  const onCountryChange = (event) => {
    // console.log("event.target.value-->", event.target.value);
    setSelectedCountry(event.target.value);
  };
  const onOrgSizeChange = (event) => {
    // console.log("event.target.valueaaaa-->", event.target.value);
    setSelectedOrgSize(event.target.value);
  };
  useEffect(() => {
    getCountryList();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {isLoading && <Loader />}
      <Image
        src={links.ImgAuthBanner}
        className="w-full h-96 object-cover"
        alt="Picture of the author"
      />
      <div className="container mx-auto mt-3 flex flex-wrap justify-between px-4">
        {/* left side */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-4xl font-bold text-black">
            Register to{" "}
            <span className="text-4xl font-bold text-primary">Manage</span> the
            new experience
          </h1>

          <p className="text-lg text-black mt-3">
            If you have an account you can{" "}
            <Link href="/login">
              <span className="text-lg text-primary font-medium">
                logIn here
              </span>
            </Link>
          </p>
        </div>
        {/* right side */}
        <div className="w-full lg:w-1/2 rounded-md bg-white border px-4 lg:px-6 py-5 mt-10 lg:mt-0 border-borderColor">
          <p className="text-black text-center font-bold text-2xl">
            Welcome to smarTScrum
          </p>
          <p className="text-center font-normal text-base text-darkGrayishBlue mt-3">
            A Warm welcome <br /> to the new era of the project management
            application
          </p>
          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col lg:flex-row gap-5">
                {/* first name */}
                <div className="flex-1">
                  <label className="text-sm font-bold">
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
                    className="w-full border rounded-md px-4 py-2 mt-1 text-darkGray text-sm font-normal border-inputBorderColor"
                    id="firstName"
                    placeholder={strings.firstNamePh}
                    name="firstName"
                    readOnly={user?.userData?.Name != ""}
                  />
                  <span className="text-darkRed text-sm font-normal">
                    {errors.firstName?.message}
                  </span>
                </div>
                {/* last name */}
                <div className="flex-1">
                  <label className="text-sm font-bold">
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
                    className="w-full border rounded-md px-4 py-2 mt-1 text-darkGray text-sm font-normal border-inputBorderColor"
                    id="lastName"
                    placeholder={strings.lastNamePh}
                    name="lastName"
                    readOnly={user?.userData?.Name != ""}
                  />
                </div>
              </div>
              {/* email */}
              <div className="mt-3">
                <label className="text-sm font-bold">
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
                  className="w-full border rounded-md px-4 py-2 mt-1 text-darkGray text-sm font-normal border-inputBorderColor"
                  id="email"
                  placeholder={strings.emailPh}
                  name="email"
                  readOnly={user?.userData?.Email != ""}
                />
                <span className="text-darkRed text-sm font-normal">
                  {errors.email?.message}
                </span>
              </div>
              {/* password */}
              <div className="mt-3">
                <label className="text-sm font-bold">
                  {strings.passLabel} <span className="text-darkRed">*</span>
                </label>
                <div className="relative">
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
                    className="w-full border rounded-md px-4 py-2 mt-1 text-darkGray text-sm font-normal border-inputBorderColor"
                    id="password"
                    placeholder={strings.passLabelPh}
                    name="password"
                  />
                  <span
                    className="absolute top-3 right-4 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    <Icon
                      icon={showPassword ? "bi:eye-slash" : "bi:eye"}
                      className="text-darkGray"
                    />
                  </span>
                </div>
                <span className="text-darkRed text-sm font-normal">
                  {errors.password?.message}
                </span>
              </div>
              {/* confirm password */}
              <div className="mt-3">
                <label className="text-sm font-bold">
                  {strings.confirmPassLabel}
                  <span className="text-darkRed">*</span>
                </label>
                <div className="relative">
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
                    className="w-full border rounded-md px-4 py-2 mt-1 text-darkGray text-sm font-normal border-inputBorderColor"
                    id="confirmPassword"
                    placeholder={strings.confirmPassLabelPh}
                    name="confirmPassword"
                  />
                  <span
                    className="absolute top-3 right-4 cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <Icon
                      icon={showConfirmPassword ? "bi:eye-slash" : "bi:eye"}
                      className="text-darkGray"
                    />
                  </span>
                </div>
                <span className="text-darkRed text-sm font-normal">
                  {errors.confirmPassword?.message}
                </span>
              </div>
              {/* organization name */}
              <div className="mt-3">
                <label className="text-sm font-bold">
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
                  className="w-full border rounded-md px-4 py-2 mt-1 text-darkGray text-sm font-normal border-inputBorderColor"
                  id="organizationName"
                  placeholder={strings.orgNamePh}
                  name="organizationName"
                />
                <span className="text-darkRed text-sm font-normal">
                  {errors.organizationName?.message}
                </span>
              </div>
              {/* organization address */}
              <div className="mt-3">
                <label className="text-sm font-bold">
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
                  className="w-full border rounded-md px-4 py-2 mt-1 text-darkGray text-sm font-normal border-inputBorderColor"
                  id="organizationAddress"
                  placeholder={strings.orgAddressPh}
                  name="organizationAddress"
                />
                <span className="text-darkRed text-sm font-normal">
                  {errors.organizationAddress?.message}
                </span>
              </div>
              {/* organization size dropdown */}
              <div className="mt-3 flex flex-col lg:flex-row gap-5">
                <div className="flex-1">
                  <label className="text-sm font-bold">
                    {strings.orgDropdownLabel}
                    <span className="text-darkRed">*</span>
                  </label>
                  <select
                    value={selectedOrgSize}
                    onChange={onOrgSizeChange}
                    className="mt-1 p-2 border border rounded-md w-full bg-primary text-white font-medium "
                  >
                    <option value="">Select size</option>
                    {orgSizeList.map((item) => (
                      <option key={item.size} value={item.size}>
                        {item.size}
                      </option>
                    ))}
                  </select>
                </div>
                {/* country dropdown */}
                <div className="flex-1">
                  <label className="text-sm font-bold">
                    {strings.countryLable}
                    <span className="text-darkRed">*</span>
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={onCountryChange}
                    className="mt-1 p-2 border border rounded-md w-full bg-primary text-white font-medium "
                  >
                    <option value="">Select country</option>
                    {countryList.map((country) => (
                      <option key={country.ID} value={country.ID}>
                        {country.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex items-start">
                <Checkbox
                  radius="sm"
                  isSelected={keepSelected}
                  onValueChange={setKeepSelected}
                  // className="mr-2"
                />
                <div>
                  <p className="text-sm font-normal text-darkGray mb-1">
                    Keep me updated about the new features and upcoming
                    improvements (by doing this you accept the
                    <span className="text-primary"> terms</span> and{" "}
                    <span className="text-primary">the privacy policy</span>
                    ).
                  </p>
                </div>
              </div>

              {/* bottom view */}
              <Button
                type="submit"
                // onClick={() => {
                //   onSubmit();
                // }}
                className="text-xl p-2 border rounded-md mt-3 bg-primary w-full font-medium text-white text-center items-center"
              >
                Let’s Start
              </Button>
              <p className="text-primary text-center text-sm font-medium my-1">
                or
              </p>
              <div className="flex justify-center items-center">
                <Button
                  onClick={() => {
                    // Handle Google Sign-In logic here
                    window.open(
                      `${process.env.API_URL}/auth/google/callback`,
                      "_self"
                    );
                  }}
                  className="bg-white border border-primary"
                  startContent={
                    <Image
                      src={links.ImgGoogle}
                      style={{
                        height: 25,
                        width: 25,
                        borderRadius: 50,
                      }}
                      alt="Google logo"
                    />
                  }
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
