import {Helmet} from 'react-helmet';
import React from 'react';

export default function Landing () {
  return (
    <div className="page p-4 markdown mt-16 max-w-full">
      <Helmet>
        <title>DraCor ONE – The Database of German-Language One-Act Plays (1740–1850)</title>
      </Helmet>
      <section className="flex flex-col my-16 lg:flex-row">
          <article className="self-center m-6 lg:ml-12 lg:mr-16">
              <h1>The Database of German-Language One-Act Plays</h1>
              <p className="italic text-2xl">1740–1850</p>
              <strong>Edited by Dîlan Canan Çakir and Frank Fischer</strong>
              <p>Our aim is to provide a general quantitative overview of one-act plays written in German between the mid-18th and mid-19th centuries.</p>
              <button className="rounded-lg bg-primary px-4 py-2 drop-shadow-lg hover:drop-shadow-md text-neutral-100">About the project</button>
          </article>
          <a href="/">
          <img src="/database.png" className="overflow-hidden drop-shadow-2xl rounded-lg bg-primary hover:bg-blend-darken" />
          </a>
      </section>
    </div>
  );
}