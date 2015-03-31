sbtPlugin := true

organization := "com.typesafe.sbt"

name := "sbt-coffeescript"

version := "1.0.1-SNAPSHOT"

scalaVersion := "2.10.5"

scalacOptions ++= Seq("-feature", "-deprecation", "-Xfatal-warnings", "-Xlint")

libraryDependencies ++= Seq(
  "org.webjars" % "typescript" % "1.4"
)

addSbtPlugin("com.typesafe.sbt" % "sbt-js-engine" % "1.0.2")

publishMavenStyle := false

publishTo := {
    if (isSnapshot.value) Some(Classpaths.sbtPluginSnapshots)
        else Some(Classpaths.sbtPluginReleases)
}

