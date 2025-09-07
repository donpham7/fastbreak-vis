import React, { useState } from "react";
import * as Separator from "@radix-ui/react-separator";
import BarChartTemplate from "./components/lib/BarChartTemplate.js";
import { sendUserQuery } from "../lib/serverFunctions/server_api.js";

export default function Sandbox() {
    async function sendQuery(query) {
        await sendUserQuery(query);
    }

    const [userQuery, setUserQuery] = useState("");

    return (
        <div className="bg-surface_2 min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">Sandbox Page</h1>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Text Input Example</h2>
                <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="rounded-lg border border-gray-300 p-2 w-full mb-2"
                    placeholder="Type something..."
                />
                <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => sendQuery(userQuery)}
                >
                    Enter
                </button>
            </div>
            <Separator.Root
                className="SeparatorRoot my-8"
                decorative
                orientation="horizontal"
            />
            <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Template Card</h2>
                <div className="flex items-center">
                    <img
                        src="https://picsum.photos/id/1015/80/80"
                        alt="Example"
                        className="w-20 h-20 rounded-full object-cover mr-4 border border-gray-300"
                    />
                    <div>
                        <span className="font-semibold text-black text-lg">
                            Example Name
                        </span>
                        <div className="text-gray-500 text-sm">
                            Example Detail
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
