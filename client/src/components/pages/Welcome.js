import React from "react";
import { Link } from "react-router-dom";

function Welcome() {
	return (
		<div className="pt-24 mt-14">
			<div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
				<div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left">
					<p className="uppercase tracking-loose w-full">
						Want to talk?
					</p>
					<h1 className="my-4 text-5xl font-bold leading-tight">
						Chat
					</h1>
					<p className="leading-normal text-2xl mb-8">
						Used by SpongeBob, Patrick etc!
					</p>

					<div>
						<Link to="/signup">
							<button className="justify-center mx-auto bg-purple-500 border mb-4 md:ml-1 rounded-full text-white py-4 px-8 border-white shadow focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
								Sign Up
							</button>
						</Link>
					</div>
				</div>

				<div className="w-full md:w-3/5 py-6 text-center">
					<img
						className="w-full md:w-5/5 z-50 opacity-90"
						alt="chat-screetshot"
						src="screenshot.png"
					/>
				</div>
			</div>
		</div>
	);
}

export default Welcome;
