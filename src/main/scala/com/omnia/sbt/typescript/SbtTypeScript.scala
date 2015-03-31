package com.omnia.sbt.typescript

import com.typesafe.sbt.jse.SbtJsTask
import sbt._
import com.typesafe.sbt.web.SbtWeb
import spray.json.JsObject
import sbt.Keys._

object Import {

  object TypeScriptKeys {
    val typescript = TaskKey[Seq[File]]("typescript", "Invoke the TypeScript compiler.")
  }
}

object SbtTypeScript extends AutoPlugin {

  override def requires = SbtJsTask

  override def trigger = AllRequirements

  val autoImport = Import

  import SbtWeb.autoImport._
  import WebKeys._
  import SbtJsTask.autoImport.JsTaskKeys._
  import autoImport.TypeScriptKeys._

  val typeScriptUnscopedSettings = Seq(
    includeFilter := "*.ts",
    jsOptions := JsObject().toString()
  )

  override def projectSettings = inTask(typescript)(
    SbtJsTask.jsTaskSpecificUnscopedSettings ++
      inConfig(Assets)(typeScriptUnscopedSettings) ++
      inConfig(TestAssets)(typeScriptUnscopedSettings) ++
      Seq(
        moduleName := "typescript",
        shellFile := getClass.getClassLoader.getResource("typescript-shell.js"),

        taskMessage in Assets := "TypeScript compiling",
        taskMessage in TestAssets := "TypeScript test compiling"
      )
  ) ++ SbtJsTask.addJsSourceFileTasks(typescript) ++ Seq(
    typescript in Assets := (typescript in Assets).dependsOn(webModules in Assets).value,
    typescript in TestAssets := (typescript in TestAssets).dependsOn(webModules in TestAssets).value
  )

}
