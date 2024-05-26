import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button, Checkbox } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { strings } from "@strings";
import { links } from "@constants/config";
import { userLogin } from "src/utils/apiService";
import { Loader } from "@components/Loader/Loader";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [keepSelected, setKeepSelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const body = {
          email: data.email,
          password: data.password,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        try {
          const response = await userLogin(body);
          setIsLoading(false);
          reset();
        } catch (error) {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        toast.error(strings.geoLocationError);
      }
    );
  };

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
            Login to{" "}
            <span className="text-4xl font-bold text-primary">Manage</span>{" "}
            fantastic things
          </h1>

          <p className="text-lg text-black mt-3">
            If you have an account you can{" "}
            <Link href="/register">
              <span className="text-lg text-primary font-medium">
                register here
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

              <div className="mt-3 flex items-start">
                <Checkbox
                  radius="sm"
                  isSelected={keepSelected}
                  onValueChange={setKeepSelected}
                  // className="mr-2"
                />
                <div>
                  <p className="text-sm font-normal text-darkGray mb-1">
                    Remember me
                  </p>
                </div>
              </div>

              {/* bottom view */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="text-xl p-2 border rounded-md bg-primary w-full  font-medium text-white text-center items-center mt-3"
                >
                  Log in
                </Button>
              </div>
              <p className="text-darkGray text-center text-sm font-bold my-3 ">
                OR LOGIN WITH
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
                  className="bg-white border border-primary "
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
export default Login;
