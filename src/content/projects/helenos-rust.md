---
name: Rust for HelenOS
links:
  - name: Full thesis text
    href: /s/b-thesis.pdf
  - name: Project poster
    href: /s/b-poster.pdf
read_more: true
timespan: May 2024 – May 2025
ordering_value: 20240301
tags:
  - Rust
  - Operating System development
description: |
  As my Bachelor Thesis, I worked on adding support for the [HelenOS operating system](https://www.helenos.org) to the Rust compiler. My work has successfully enabled easy compilation of Rust programs for HelenOS, including GUI programs written with the Iced UI framework. This project had me digging in the internals of the Rust standard library as well as HelenOS system API implementations. I also needed to gain a good understanding of the ELF binary format, the linking procedure and generally, as a result of this thesis I have solid experience with many systems programming topics.
---

Best overview of my thesis can be seen in the project poster below (also downloadable as a [PDF](/s/b-poster.pdf)).

You can also download a [HelenOS bootable ISO with preinstalled Rust programs](/s/helenos-rust-x86_64.iso). Run it with QEMU like this:

```bash
qemu-system-x86_64 -device e1000,netdev=n1 -netdev \
user,id=n1,hostfwd=tcp::8080-:8080,hostfwd=tcp::8081-:8081 \
-usb -device nec-usb-xhci,id=xhci -device usb-tablet -device \
intel-hda -device hda-duplex -serial stdio -boot d \
-m 2G -enable-kvm -cdrom helenos-rust-x86_64.iso
```

The following Rust applications are installed in the system: `rtest` (a test suite), [`chksum`](https://github.com/chksum-rs/cli), [`resvg`](https://github.com/linebender/resvg), [`imagecli`](https://github.com/theotherphil/imagecli), [`imageviewer-rs`](https://github.com/mvolfik/helenos-iced-apps) and [`life`](https://github.com/mvolfik/helenos-iced-apps).

![Project poster](../../assets/b-poster.png)
