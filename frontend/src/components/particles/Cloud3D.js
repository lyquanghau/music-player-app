// src/components/Cloud3D.js
import React, { useEffect } from "react";
import * as THREE from "three";

const Cloud3D = ({ id }) => {
  useEffect(() => {
    const cloudContainer = document.getElementById(id);
    if (!cloudContainer) {
      console.error("Cloud container not found!");
      return;
    }

    // Tạo scene
    const scene = new THREE.Scene();
    scene.background = null; // Nền trong suốt

    // Tạo camera
    const camera = new THREE.PerspectiveCamera(
      40,
      cloudContainer.clientWidth / cloudContainer.clientHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 15); // Nhìn ngang
    camera.lookAt(0, 0, 0);

    // Tạo renderer với nền trong suốt
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(cloudContainer.clientWidth, cloudContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Đặt độ trong suốt (alpha: 0)
    cloudContainer.appendChild(renderer.domElement);

    // Ánh sáng
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Ánh sáng môi trường
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 10, 50, 2); // Ánh sáng điểm
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Tạo nhóm cho đám mây
    const group = new THREE.Group();
    scene.add(group);

    // Tạo vật liệu cho đám mây
    const cloudMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff, // Màu trắng
      side: THREE.FrontSide,
    });

    // Tạo 4 khối cầu thẳng hàng
    const baseY = -2;
    const spheres = [
      { radius: 2, position: [-3, 0, 0] }, // Bên trái
      { radius: 3, position: [0, 0, 0] }, // Chính giữa
      { radius: 1.75, position: [3, 0, 0] }, // Bên phải 1
      { radius: 1.5, position: [4.5, 0, 0] }, // Bên phải 2
    ];

    spheres.forEach((sphereData) => {
      const sphereGeometry = new THREE.SphereGeometry(
        sphereData.radius,
        32,
        32
      );
      const sphere = new THREE.Mesh(sphereGeometry, cloudMaterial);
      sphere.position.set(
        sphereData.position[0],
        baseY + sphereData.radius, // Đặt y sao cho đáy chạm mặt phẳng
        sphereData.position[2]
      );
      group.add(sphere);
    });

    // Animation
    const animate = () => {
      group.rotation.y += 0.005; // Xoay quanh trục y
      group.position.y = Math.sin(Date.now() * 0.001) * 1; // Di chuyển lên xuống
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Xử lý resize
    const handleResize = () => {
      camera.aspect = cloudContainer.clientWidth / cloudContainer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(cloudContainer.clientWidth, cloudContainer.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (cloudContainer && renderer.domElement) {
        cloudContainer.removeChild(renderer.domElement);
      }
    };
  }, [id]); // Chạy lại useEffect nếu id thay đổi

  return <div id={id} className="cloud-container"></div>;
};

export default Cloud3D;
